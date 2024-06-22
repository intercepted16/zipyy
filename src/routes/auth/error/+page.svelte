<script lang="ts">
  import { page } from "$app/stores";
  import CircleX from "$lucide/circle-x.svelte";
  import { Button } from "$ui/button";
  import type { AuthError } from "@supabase/supabase-js";
  import type { ErrorCode } from "@supabase/auth-js/src/lib/error-codes";
  const errorParam = $page.url.searchParams.get("error");
  let error: AuthError | null;
  if (errorParam) error = JSON.parse(errorParam);
  else error = null;
  const errorsObject: Record<ErrorCode, string> = {
    otp_expired: "The link is invalid or has expired. Please try again later.",
    bad_code_verifier:
      "The OTP code was invalid; your link may have been malformed. Please try verifying again or try again later.",
    unexpected_failure: "There was an unexpected failure.",
    //TODO: implement more error messages
    validation_failed: "",
    bad_json: "",
    email_exists: "",
    phone_exists: "",
    bad_jwt: "",
    not_admin: "",
    no_authorization: "",
    user_not_found: "",
    session_not_found: "",
    flow_state_not_found: "",
    flow_state_expired: "",
    signup_disabled: "",
    user_banned: "",
    provider_email_needs_verification: "",
    invite_not_found: "",
    bad_oauth_state: "",
    bad_oauth_callback: "",
    oauth_provider_not_supported: "",
    unexpected_audience: "",
    single_identity_not_deletable: "",
    email_conflict_identity_not_deletable: "",
    identity_already_exists: "",
    email_provider_disabled: "",
    phone_provider_disabled: "",
    too_many_enrolled_mfa_factors: "",
    mfa_factor_name_conflict: "",
    mfa_factor_not_found: "",
    mfa_ip_address_mismatch: "",
    mfa_challenge_expired: "",
    mfa_verification_failed: "",
    mfa_verification_rejected: "",
    insufficient_aal: "",
    captcha_failed: "",
    saml_provider_disabled: "",
    manual_linking_disabled: "",
    sms_send_failed: "",
    email_not_confirmed: "",
    phone_not_confirmed: "",
    reauth_nonce_missing: "",
    saml_relay_state_not_found: "",
    saml_relay_state_expired: "",
    saml_idp_not_found: "",
    saml_assertion_no_user_id: "",
    saml_assertion_no_email: "",
    user_already_exists: "",
    sso_provider_not_found: "",
    saml_metadata_fetch_failed: "",
    saml_idp_already_exists: "",
    sso_domain_already_exists: "",
    saml_entity_id_mismatch: "",
    conflict: "",
    provider_disabled: "",
    user_sso_managed: "",
    reauthentication_needed: "",
    same_password: "",
    reauthentication_not_valid: "",
    otp_disabled: "",
    identity_not_found: "",
    weak_password: "",
    over_request_rate_limit: "",
    over_email_send_rate_limit: "",
    over_sms_send_rate_limit: ""
  };

  // Convert the object to a Map right here
  const errors: Map<ErrorCode, string> = new Map(
    Object.entries(errorsObject) as Array<[ErrorCode, string]>
  );
</script>

<div class="flex flex-col items-center justify-center my-36">
  <CircleX class="w-16 h-16 text-red-500" />
  <div class="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
    Verification <span class="text-red-500 excludedText">failed</span>.
  </div>
  <p
    class="max-w-xl my-4 text-xl font-normal text-center text-gray-500 lg:text-xl dark:text-gray-400">
    {errors.get("otp_expired") ||
      "No error description provided. Please refer to the error code or contact support."}
  </p>
  <span class="text-sm italic mb-2">ERR: {error?.code}</span>
  <Button class="btn md:btn-lg md:w-fit variant-filled-primary" href="/">Go home</Button>
</div>
