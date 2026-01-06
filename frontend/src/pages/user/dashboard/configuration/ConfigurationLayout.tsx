import { useState } from "react";
import Sidebar from "./Sidebar";
import BusinessForm from "./forms/BusinessForm";
import type { ConfigurationDTO } from "../../../../dto/configurationDTO";

type Section = "business";

export default function ConfigurationLayout({
  configuration,
}: {
  configuration: ConfigurationDTO;
}) {
  const [section, setSection] = useState<Section>("business");

  return (
    <div className="configuration-workspace">
      <Sidebar active={section} onSelect={setSection} />

      <main className="configuration-main">
        {section === "business" && (
          <BusinessForm configuration={configuration} />
        )}
      </main>
    </div>
  );
}
