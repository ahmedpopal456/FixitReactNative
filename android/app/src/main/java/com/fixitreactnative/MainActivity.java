package fixit.android;

import com.facebook.react.ReactActivity;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;
import android.os.Bundle;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "FixitReactNative";
  }

  protected void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);

       if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
              NotificationChannel notificationChannel = new NotificationChannel("fixit-default-channel", "Fixit", NotificationManager.IMPORTANCE_HIGH);
              notificationChannel.setShowBadge(true);
              notificationChannel.setDescription("Default notification channel used by Fixit");
              notificationChannel.enableVibration(true);
              notificationChannel.enableLights(true);
              notificationChannel.setVibrationPattern(new long[]{400, 200, 400});
              NotificationManager manager = getSystemService(NotificationManager.class);
              manager.createNotificationChannel(notificationChannel);
          }
    }
}
