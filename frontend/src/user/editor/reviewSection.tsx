import type { ConfigurationBaseReadDTO } from "./api/DataTransferObject/ConfigurationBaseReadDTO";
//DEPRECATED

export default function ReviewSection({
    configuration,
  }: {
    configuration: ConfigurationBaseReadDTO;
  }) {
    return (
      <section>
        <h2>Riepilogo configurazione</h2>
  
        <pre>
          {JSON.stringify(configuration, null, 2)}
        </pre>
      </section>
    );
  }