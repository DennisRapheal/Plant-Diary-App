import { StatusBar } from "expo-status-bar";
import { Redirect, Tabs } from "expo-router";
import { Image, Text, View } from "react-native";

import { icons } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="flex items-center justify-center gap1">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        // icon size
        className="w-20 h-20"
      />
      {/* <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text> */}
    </View>
  );
};

const TabsLayout = () => {
  return (
    <>
      <Tabs
        // tabs styling
        screenOptions={{
          tabBarActiveTintColor: "#fff", // focus color
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarShowLabel: false,
          tabBarStyle: {
            shadowRadius: 4,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            backgroundColor: "#72847a",
            height: 100,
          },
        }}
      >
        // create a route button for all pages
        <Tabs.Screen 
          name='home'
          options={{
            title: 'Home',
            headerShown: false, 
            tabBarIcon: ({color, focused}) => (
              <TabIcon 
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            )
          }}
        />

        <Tabs.Screen
          name="create"
          options={{
            title: "Create",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.create}
                color={color}
                name="Create"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="identify"
          options={{
            title: "Identify",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.identify}
                color={color}
                name="identify"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  )
}

export default TabsLayout
