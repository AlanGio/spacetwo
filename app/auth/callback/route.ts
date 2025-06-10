import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Error exchanging code for session:", error);
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=auth_error`
        );
      }
    } catch (error) {
      console.error("Error in auth callback:", error);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=auth_error`
      );
    }
  }

  // Redirect to home page on successful authentication
  return NextResponse.redirect(`${requestUrl.origin}/`);
}
