import React from "react";
import { Text, View } from "react-native";

import { ExternalLink } from "./external-link";
import { MonoText } from "./styled-text";

export default function EditScreenInfo({ path }: { path: string }) {
  return (
    <View>
      <View className="items-center mx-12">
        <Text className="text-base leading-6 text-center text-gray-800 dark:text-gray-200">
          Mở code cho screen này tại:
        </Text>

        <View className="bg-gray-100 dark:bg-gray-800 rounded px-1 my-2">
          <MonoText>{path}</MonoText>
        </View>

        <Text className="text-base leading-6 text-center text-gray-800 dark:text-gray-200">
          Đổi text, lưu file, và app sẽ tự động cập nhật.
        </Text>
      </View>

      <View className="mt-4 mx-5 items-center">
        <ExternalLink
          className="py-4"
          href="https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet"
        >
          <Text className="text-center text-blue-500 dark:text-blue-400">
            Nhấn vào đây nếu app không tự động cập nhật sau khi thay đổi.
          </Text>
        </ExternalLink>
      </View>
    </View>
  );
}
