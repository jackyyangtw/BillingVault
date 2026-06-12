import type { KeyboardEvent } from "react";
import type { BillingCycle } from "@/mocks/plans";

type CycleSelectorProps = {
  selectedCycle: BillingCycle;
  onCycleChange: (cycle: BillingCycle) => void;
};

export default function CycleSelector({
  selectedCycle,
  onCycleChange,
}: CycleSelectorProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    event.preventDefault();
    onCycleChange(selectedCycle === "monthly" ? "yearly" : "monthly");
  }

  return (
    <div
      role="radiogroup"
      aria-label="付款週期"
      className="mb-4 flex items-center gap-2"
      onKeyDown={handleKeyDown}
    >
      <CycleButton
        cycle="monthly"
        label="月繳"
        isSelected={selectedCycle === "monthly"}
        onCycleChange={onCycleChange}
      />
      <CycleButton
        cycle="yearly"
        label="年繳"
        isSelected={selectedCycle === "yearly"}
        onCycleChange={onCycleChange}
      />
    </div>
  );
}

type CycleButtonProps = {
  cycle: BillingCycle;
  label: string;
  isSelected: boolean;
  onCycleChange: (cycle: BillingCycle) => void;
};

function CycleButton({
  cycle,
  label,
  isSelected,
  onCycleChange,
}: CycleButtonProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={() => onCycleChange(cycle)}
      className={`focus-visible:ring-ring/30 rounded-full px-4 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-3 ${
        isSelected
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
