
export function EmailTemplate({ username, verification_code, status }) {
  return (
    <div>
      <h1>Welcome, {username}!</h1>

      {verification_code && (
        <>
          <p>Your verification code is: <strong>{verification_code}</strong></p>
          <p>Your code will expire in 6 minutes.</p>
        </>
      )}

      {status && (
        <p>Your account status has been updated to: <strong>{status}</strong></p>
      )}

      <p>Thank you for using our service.</p>
    </div>
  );
}
