import { NextResponse } from "next/server";
import { supabase } from "@/utils/createClient";

export async function POST(request) {
  try {
    const { shopId } = await request.json();

    if (!shopId) {
      return NextResponse.json(
        { error: "Shop ID is required." },
        { status: 400 }
      );
    }

    // Fetch all roles associated with the shop from shop_user_roles
    const { data: roleData, error: roleError } = await supabase
      .from("shop_user_roles")
      .select("user_id, role, user_email")
      .eq("shop_id", shopId);

    if (roleError) {
      return NextResponse.json(
        { error: "Failed to fetch shop roles.", details: roleError.message },
        { status: 500 }
      );
    }

    // Create a response array
    const responseArray = [];

    // Loop through each role entry and check if the user exists in the users table
    for (const role of roleData) {
      const { user_email: userEmail } = role;

      // Search for user in users table by email
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, email, profile_photo, first_name, last_name")
        .eq("email", userEmail)
        .single();

      if (userError) {
        // If user doesn't exist, return userExist: false
        responseArray.push({
          userExist: false,
          userEmail,
          role: role.role,
        });
      } else {
        // If user exists, return user data with userExist: true
        responseArray.push({
          userExist: true,
          userId: userData.id,
          userEmail: userData.email,
          profilePhoto: userData.profile_photo,
          firstName: userData.first_name,
          lastName: userData.last_name,
          role: role.role,
        });
      }
    }

    // Return the array of user data and roles
    return NextResponse.json(responseArray, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
