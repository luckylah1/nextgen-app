package za.co.indabamenscorner.nextgen;

import android.Manifest;
import android.telephony.SmsManager;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;

@CapacitorPlugin(
    name = "DirectSms",
    permissions = {
        @Permission(strings = { Manifest.permission.SEND_SMS }, alias = "sms")
    }
)
public class DirectSmsPlugin extends Plugin {

    @PluginMethod
    public void sendDirectSms(PluginCall call) {
        String phone = call.getString("phone");
        String message = call.getString("message");

        if (phone == null || message == null) {
            call.reject("Phone number and message are required");
            return;
        }

        // Check if Android has granted SEND_SMS permission
        if (getPermissionState("sms") != com.getcapacitor.PermissionState.GRANTED) {
            requestPermissionForAlias("sms", call, "smsPermCallback");
            return;
        }

        executeSend(phone, message, call);
    }

    @com.getcapacitor.annotation.PermissionCallback
    private void smsPermCallback(PluginCall call) {
        if (getPermissionState("sms") == com.getcapacitor.PermissionState.GRANTED) {
            String phone = call.getString("phone");
            String message = call.getString("message");
            executeSend(phone, message, call);
        } else {
            call.reject("SMS permission was denied by the user");
        }
    }

    private void executeSend(String phone, String message, PluginCall call) {
        try {
            SmsManager smsManager = SmsManager.getDefault();
            // Splits long messages if coordinates exceed 160 characters
            java.util.ArrayList<String> parts = smsManager.divideMessage(message);
            smsManager.sendMultipartTextMessage(phone, null, parts, null, null);

            JSObject ret = new JSObject();
            ret.put("status", "sent");
            call.resolve(ret);
        } catch (Exception ex) {
            call.reject("Failed to send background SMS: " + ex.getMessage());
        }
    }
}