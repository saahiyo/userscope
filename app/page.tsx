import { HomeClient } from '@/components/HomeClient';
import { PLATFORM_COUNT, SCAN_RULE_COUNT } from '@/lib/osint/platformDirectory';

export default function Home() {
  return <HomeClient platformCount={PLATFORM_COUNT} scanRuleCount={SCAN_RULE_COUNT} />;
}
