/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(auth)` | `/(auth)/sign-in` | `/(auth)/sign-up` | `/(tabs)` | `/(tabs)/Diary/DiaryHome` | `/(tabs)/Diary/DiarySetting` | `/(tabs)/Diary/DiaryWater` | `/(tabs)/create` | `/(tabs)/home` | `/(tabs)/identify` | `/Diary/DiaryHome` | `/Diary/DiarySetting` | `/Diary/DiaryWater` | `/_sitemap` | `/create` | `/home` | `/identify` | `/sign-in` | `/sign-up`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
