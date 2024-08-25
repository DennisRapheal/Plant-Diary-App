import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { images } from "../../constants";
import CustomButton from "../../components/addButton/CustomButton";
import FormField from "@/components/LogForm/FormField";
import React  from "react";
import { useGlobalContext } from "../../context/GlobalProvider";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
const SignIn = () => {

    const { setUser, setIsLogged } = useGlobalContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
      email: "",
      password: "",
    });

    const submit = async () => {
        const { email, password } = form
        setIsSubmitting(true)
        setIsLogged(true);

        try {
            await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              // Signed in
              const user = userCredential.user;
              user.getIdToken().then(async (idToken) => {
                await setDoc(doc(db, "tokens", user.uid), {
                  uid: user.uid,
                  idToken: idToken,
                  createdAt: Timestamp.now(),
                });
              });
            });
        }catch(err) {
            console.log(err)
        }finally {
            setIsLogged(false);
            setIsSubmitting(false)
        }
    }

    return (
        <SafeAreaView className="bg-[#0b4739] h-full">
          <ScrollView>
            <View
              className="w-full flex justify-center min-h-[85vh] px-4 my-6"
              style={{
                minHeight: Dimensions.get("window").height - 100,
              }}
            >
    
              <Text className="text-3xl font-semibold text-[#fff7ed] mt-10 font-psemibold">
                Log in to Plantary
              </Text>
    
              <FormField
                title="Email"
                value={form.email}
                handleChangeText={(e) => setForm({ ...form, email: e })}
                otherStyles="mt-7"
                keyboardType="email-address"
                placeholder={"Enter your email address"}
              />
    
              <FormField
                title="Password"
                value={form.password}
                handleChangeText={(e) => setForm({ ...form, password: e })}
                otherStyles="mt-7"
                placeholder={"Enter your password"}
              />
    
              <CustomButton
                title="Sign In"
                handlePress={submit}
                containerStyles="mt-7"
                isLoading={isSubmitting}
                textColor="#14532d"
                containColor="#fff7ed"
              />
    
              <View className="flex justify-center pt-5 flex-row gap-2">
                <Text className="text-lg text-gray-100 font-pregular">
                  Don't have an account?
                </Text>
                <Link
                  href="/sign-up"
                  className="text-lg font-psemibold text-[#bbf7d0]"
                >
                  Sign Up
                </Link>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      );    
}

export default SignIn