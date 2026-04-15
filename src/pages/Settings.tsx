import CompanySettings from "../components/CompanySettings";
import type { CompanyInfo } from "../utils/types";

interface Props {
  companyInfo: CompanyInfo;
  setCompanyInfo: React.Dispatch<React.SetStateAction<CompanyInfo>>;
}

export default function SettingsPage({ companyInfo, setCompanyInfo }: Props) {
  return (
    <CompanySettings companyInfo={companyInfo} setCompanyInfo={setCompanyInfo} />
  );
}