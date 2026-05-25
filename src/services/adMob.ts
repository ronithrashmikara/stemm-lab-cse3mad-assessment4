export const ADMOB_TEST_BANNER_ID = 'ca-app-pub-3940256099942544/6300978111';

export type AdMobReadiness = {
  configured: boolean;
  testBannerId: string;
  implementationNote: string;
};

export function getAdMobReadiness(): AdMobReadiness {
  return {
    configured: true,
    testBannerId: ADMOB_TEST_BANNER_ID,
    implementationNote:
      'This project includes a test ad placement and test banner ID. For a production APK, add react-native-google-mobile-ads with EAS build credentials and replace the test ID only after review.',
  };
}
