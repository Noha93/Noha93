import { Redirect } from 'expo-router';

// This tab's press is intercepted in the tab bar (see _layout.tsx) to push
// /sos as a modal instead of switching tabs. This route only renders if
// reached directly some other way, in which case we just forward to /sos.
export default function SosLauncher() {
  return <Redirect href="/sos" />;
}
