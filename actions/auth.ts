"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

export async function signUp(formData: FormData) {
    const supabase = await createClient();
    const credential = {
        username: formData.get("username") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    }

    const { error, data } = await supabase.auth.signUp({
        email: credential.email,
        password: credential.password,
        options: {
            data: {
                username: credential.username
            }
        }
    });

    if (error) {
        return {
            status: error?.message,
            user: null,
        };
    } else if (data?.user?.identities?.length === 0) {
        return {
            status: "User with this email already exists, pleas login",
            user: null
        }
    }

    revalidatePath("/", "layout")
    return { status: "success", user: data.user }
}