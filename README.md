# fiza-web-studio

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-lk6jprrp)

## Contact form email notifications

The contact form sends submissions to the Supabase Edge Function at `supabase/functions/send-contact-email/index.ts`. The function sends a formatted HTML email to `fizawebstudio@gmail.com` with the submitted name, email, phone (if provided), project type, budget, message, and submission time.

### Frontend configuration

Copy `.env.example` to `.env.local`, then set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the Project URL and anon/public key shown in your Supabase project's API settings. Restart the Vite dev server after editing `.env.local`.

### Email and deployment configuration

In Supabase, open **Project Settings > Edge Functions > Secrets** and add:

- `GMAIL_USER`: the Gmail account used to send the notification (use `fizawebstudio@gmail.com` if sending from that inbox).
- `GMAIL_APP_PASSWORD`: an app password created for that Gmail account; do not use or publish the account's regular password.

Deploy the function from the project folder after configuring the secrets:

```sh
supabase functions deploy send-contact-email
```

The notification template and recipient are configured in `supabase/functions/send-contact-email/index.ts`. The form clears its fields only after the function confirms that the email was sent; on an error, it keeps the entries so they can be retried.
