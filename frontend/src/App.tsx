import { useState } from "react";
import Header from "./components/layout/Header";
import PatientList from "./components/patient/PatientList";
import AnomalyFilter from "./components/anomaly/AnomalyFilter";
import RegisterPatientForm from "./components/patient/RegisterPatientForm";
import { useSchedule } from "./hooks/useSchedule";
import type { Unit } from "./types/patient.types";

export default function App() {
  const [selectedUnit, setSelectedUnit] = useState<Unit>("ICU");
  const [showAnomaliesOnly, setShowAnomaliesOnly] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const { data: schedule, loading, error, refetch } = useSchedule(selectedUnit);

  const anomalyCount = schedule.filter(
    (entry) => (entry.session?.anomalies?.length ?? 0) > 0
  ).length;

  const filteredSchedule = showAnomaliesOnly
    ? schedule.filter((entry) => (entry.session?.anomalies?.length ?? 0) > 0)
    : schedule;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        selectedUnit={selectedUnit}
        onUnitChange={(unit) => {
          setSelectedUnit(unit);
          setShowAnomaliesOnly(false);
        }}
        anomalyCount={anomalyCount}
      />

      <main className="max-w-7xl mx-auto px-6 py-6">
        <PatientList
          schedule={filteredSchedule}
          loading={loading}
          error={error}
          showAnomaliesOnly={showAnomaliesOnly}
          selectedUnit={selectedUnit}
          onSessionUpdate={refetch}
          onRegisterClick={() => setShowRegisterForm(true)}
          filterSlot={
            <AnomalyFilter
              enabled={showAnomaliesOnly}
              onToggle={() => setShowAnomaliesOnly((prev) => !prev)}
              anomalyCount={anomalyCount}
            />
          }
        />
      </main>

      {showRegisterForm && (
        <RegisterPatientForm
          defaultUnit={selectedUnit}
          onClose={() => setShowRegisterForm(false)}
          onSuccess={() => {
            setShowRegisterForm(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}