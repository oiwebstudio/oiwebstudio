package com.oistudio.mipanel;

import android.app.AppOpsManager;
import android.app.usage.UsageEvents;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Process;
import android.provider.Settings;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Lee el tiempo de uso del móvil que guarda el propio Android.
 *
 * Por qué a mano y no con un plugin de la tienda: no existe ninguno para
 * Capacitor -- lo busqué en npm y no hay nada mantenido.
 *
 * Por qué con eventos y no con queryUsageStats: los totales que devuelve
 * queryUsageStats vienen ya agregados por el sistema en cubos que no siempre
 * cuadran con el día natural, y en varios fabricantes salen inflados. Sumar
 * los pares "app al frente" -> "app al fondo" es más trabajo pero da el
 * mismo número que enseña Bienestar Digital.
 *
 * El permiso PACKAGE_USAGE_STATS es especial: no hay diálogo que pedir, lo
 * activa el usuario a mano en Ajustes. De ahí abrirAjustes().
 */
@CapacitorPlugin(name = "UsoMovil")
public class UsoMovilPlugin extends Plugin {

    /** ¿Nos han dado ya acceso de uso? */
    private boolean concedido() {
        Context ctx = getContext();
        AppOpsManager ops = (AppOpsManager) ctx.getSystemService(Context.APP_OPS_SERVICE);
        if (ops == null) return false;
        int modo;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            modo = ops.unsafeCheckOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS,
                    Process.myUid(), ctx.getPackageName());
        } else {
            modo = ops.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS,
                    Process.myUid(), ctx.getPackageName());
        }
        // DEFAULT quiere decir "decide el permiso normal", así que hay que mirarlo
        if (modo == AppOpsManager.MODE_DEFAULT) {
            return ctx.checkCallingOrSelfPermission(android.Manifest.permission.PACKAGE_USAGE_STATS)
                    == PackageManager.PERMISSION_GRANTED;
        }
        return modo == AppOpsManager.MODE_ALLOWED;
    }

    @PluginMethod
    public void tienePermiso(PluginCall call) {
        JSObject r = new JSObject();
        r.put("concedido", concedido());
        call.resolve(r);
    }

    /** Abre la pantalla de Ajustes donde se concede. No se puede automatizar. */
    @PluginMethod
    public void abrirAjustes(PluginCall call) {
        try {
            Intent i = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            // Algunos fabricantes saben abrir directamente la ficha de la app
            try {
                i.setData(Uri.parse("package:" + getContext().getPackageName()));
                getContext().startActivity(i);
            } catch (Exception e) {
                Intent simple = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
                simple.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getContext().startActivity(simple);
            }
            call.resolve();
        } catch (Exception e) {
            call.reject("No he podido abrir los ajustes de acceso de uso", e);
        }
    }

    /** Las cero horas del día que está a `atras` días de hoy. */
    private Calendar medianoche(int atras) {
        Calendar c = Calendar.getInstance();
        c.add(Calendar.DAY_OF_YEAR, -atras);
        c.set(Calendar.HOUR_OF_DAY, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        c.set(Calendar.MILLISECOND, 0);
        return c;
    }

    /**
     * Minutos por app y total, para cada uno de los últimos `dias` días.
     *
     * Devuelve { dias: [ { fecha, minutos, apps: [ {paquete, nombre, minutos} ] } ] }
     */
    @PluginMethod
    public void resumen(PluginCall call) {
        if (!concedido()) {
            call.reject("sin-permiso");
            return;
        }
        int dias = call.getInt("dias", 7);
        if (dias < 1) dias = 1;
        if (dias > 31) dias = 31;

        UsageStatsManager usm = (UsageStatsManager) getContext().getSystemService(Context.USAGE_STATS_SERVICE);
        if (usm == null) { call.reject("sin-servicio"); return; }

        PackageManager pm = getContext().getPackageManager();
        String yo = getContext().getPackageName();
        JSArray salidaDias = new JSArray();

        for (int d = dias - 1; d >= 0; d--) {
            Calendar ini = medianoche(d);
            Calendar fin = medianoche(d);
            fin.add(Calendar.DAY_OF_YEAR, 1);
            long desde = ini.getTimeInMillis();
            long hasta = Math.min(fin.getTimeInMillis(), System.currentTimeMillis());
            if (hasta <= desde) continue;

            Map<String, Long> porApp = new HashMap<>();
            Map<String, Long> abierta = new HashMap<>();

            UsageEvents ev = usm.queryEvents(desde, hasta);
            UsageEvents.Event e = new UsageEvents.Event();
            while (ev.hasNextEvent()) {
                ev.getNextEvent(e);
                String p = e.getPackageName();
                if (p == null) continue;
                int tipo = e.getEventType();
                if (tipo == UsageEvents.Event.ACTIVITY_RESUMED) {
                    abierta.put(p, e.getTimeStamp());
                } else if (tipo == UsageEvents.Event.ACTIVITY_PAUSED
                        || tipo == UsageEvents.Event.ACTIVITY_STOPPED) {
                    Long arranque = abierta.remove(p);
                    if (arranque != null && e.getTimeStamp() > arranque) {
                        long suma = porApp.containsKey(p) ? porApp.get(p) : 0L;
                        porApp.put(p, suma + (e.getTimeStamp() - arranque));
                    }
                }
            }
            // Lo que siguiera abierto al acabar la ventana cuenta hasta el final:
            // si no, el uso de ahora mismo no aparecería nunca.
            for (Map.Entry<String, Long> pendiente : abierta.entrySet()) {
                long suma = porApp.containsKey(pendiente.getKey()) ? porApp.get(pendiente.getKey()) : 0L;
                long trozo = hasta - pendiente.getValue();
                if (trozo > 0) porApp.put(pendiente.getKey(), suma + trozo);
            }

            long totalMs = 0;
            List<Map.Entry<String, Long>> lista = new ArrayList<>(porApp.entrySet());
            // De más a menos, que es como se quiere leer
            lista.sort((x, y) -> Long.compare(y.getValue(), x.getValue()));

            JSArray apps = new JSArray();
            for (Map.Entry<String, Long> par : lista) {
                long ms = par.getValue();
                if (ms < 30000) continue;            // menos de medio minuto es ruido
                totalMs += ms;
                if (apps.length() >= 12) continue;   // el total sí lo suma todo
                JSObject a = new JSObject();
                a.put("paquete", par.getKey());
                a.put("nombre", nombreDe(pm, par.getKey()));
                a.put("minutos", Math.round(ms / 60000.0));
                a.put("propia", yo.equals(par.getKey()));
                apps.put(a);
            }

            JSObject dia = new JSObject();
            dia.put("fecha", String.format("%tF", ini));
            dia.put("minutos", Math.round(totalMs / 60000.0));
            dia.put("apps", apps);
            salidaDias.put(dia);
        }

        JSObject r = new JSObject();
        r.put("dias", salidaDias);
        call.resolve(r);
    }

    /** El nombre bonito de la app; si no se puede, el del paquete. */
    private String nombreDe(PackageManager pm, String paquete) {
        try {
            ApplicationInfo ai = pm.getApplicationInfo(paquete, 0);
            return pm.getApplicationLabel(ai).toString();
        } catch (Exception e) {
            return paquete;
        }
    }
}
