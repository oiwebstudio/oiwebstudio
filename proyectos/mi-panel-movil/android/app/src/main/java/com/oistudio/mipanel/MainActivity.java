package com.oistudio.mipanel;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // El plugin del tiempo de uso es de la casa, así que hay que
        // presentarlo antes de que arranque el puente.
        registerPlugin(UsoMovilPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
