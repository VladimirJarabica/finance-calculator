"use client";

import { useRef, useEffect } from "react";
import { UseFormRegister, UseFormSetValue, Control } from "react-hook-form";
import { FieldArrayWithId } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { InvestmentCard, type FormValues } from "./investment-card";
import { TAB_COLORS } from "./constants";
import { cn } from "@/lib/utils";

interface InvestmentTabsProps {
  fields: FieldArrayWithId<FormValues, "investments", "id">[];
  activeTab: number;
  setActiveTab: (index: number) => void;
  investments: FormValues["investments"] | undefined;
  control: Control<FormValues>;
  register: UseFormRegister<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  onAddInvestment: () => void;
  onRemoveInvestment: (index: number) => void;
}

export function InvestmentTabs({
  fields,
  activeTab,
  setActiveTab,
  investments,
  control,
  register,
  setValue,
  onAddInvestment,
  onRemoveInvestment,
}: InvestmentTabsProps) {
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Update tab refs array when fields change
  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, fields.length);
  }, [fields.length]);

  // Scroll active tab into view
  useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab];
    if (activeTabElement && tabsScrollRef.current) {
      activeTabElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeTab]);

  return (
    <div className="relative">
      {/* Tabs */}
      <div
        ref={tabsScrollRef}
        className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <div className="flex items-end h-10 min-w-max pr-4">
          {fields.map((field, index) => {
            const isActive = activeTab === index;
            const colors = TAB_COLORS[index % TAB_COLORS.length];
            const canRemove = fields.length > 1;
            return (
              <div
                key={field.id}
                className={cn(
                  "relative flex items-center gap-1 rounded-t-lg transition-all shrink-0",
                  colors.bg,
                  isActive ? "py-2.5" : "py-1.5 hover:py-2"
                )}
                style={{
                  marginLeft: index > 0 ? "-4px" : 0,
                  zIndex: isActive ? 10 : fields.length - index,
                }}
              >
                <button
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  onClick={() => setActiveTab(index)}
                  className={cn(
                    "text-sm font-medium cursor-pointer px-4",
                    colors.text
                  )}
                >
                  {investments?.[index]?.name || `Investment ${index + 1}`}
                </button>
                {canRemove && isActive && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveInvestment(index);
                    }}
                    className={cn(
                      "mr-2 w-5 h-5 flex items-center justify-center rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer",
                      colors.text
                    )}
                    aria-label="Remove investment"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="9" y1="3" x2="3" y2="9" />
                      <line x1="3" y1="3" x2="9" y2="9" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
          {/* Add button */}
          <button
            onClick={onAddInvestment}
            className="ml-2 px-3 cursor-pointer py-1.5 hover:pb-2 text-sm font-medium rounded-t-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all shrink-0"
          >
            +
          </button>
        </div>
      </div>

      {/* Active card content */}
      <Card
        className={cn(
          "rounded-tl-none border-t-4",
          TAB_COLORS[activeTab % TAB_COLORS.length].border
        )}
      >
        <CardContent className="pt-6">
          <InvestmentCard
            key={fields[activeTab]?.id}
            index={activeTab}
            control={control}
            register={register}
            setValue={setValue}
          />
        </CardContent>
      </Card>
    </div>
  );
}

