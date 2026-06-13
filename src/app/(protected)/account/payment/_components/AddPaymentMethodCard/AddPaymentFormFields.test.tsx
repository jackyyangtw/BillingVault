import { render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import { Dialog } from "@/components/ui/dialog";
import type { TapPayCardStatusSnapshot } from "@/providers/tappay/cardStatusStore";
import AddPaymentFormFields from "./AddPaymentFormFields";
import type { AddPaymentFormValues } from "./schema";

const readyCardStatus: TapPayCardStatusSnapshot = {
  canGetPrime: true,
  hasInteracted: true,
  status: {
    number: 0,
    expiry: 0,
    ccv: 0,
  },
};

const incompleteCardStatus: TapPayCardStatusSnapshot = {
  canGetPrime: false,
  hasInteracted: false,
  status: {
    number: -1,
    expiry: -1,
    ccv: -1,
  },
};

type TestAddPaymentFormProps = {
  cardStatus?: TapPayCardStatusSnapshot;
  error?: string;
  isSubmitting?: boolean;
};

function TestAddPaymentForm({
  cardStatus = incompleteCardStatus,
  error = "",
  isSubmitting = false,
}: TestAddPaymentFormProps) {
  const form = useForm<AddPaymentFormValues>({
    defaultValues: {
      cardHolder: "",
      billingEmail: "",
    },
  });

  return (
    <Dialog open>
      <FormProvider {...form}>
        <form>
          <AddPaymentFormFields
            cardStatus={cardStatus}
            error={error}
            areFieldsVisible
            isSubmitting={isSubmitting}
          />
        </form>
      </FormProvider>
    </Dialog>
  );
}

describe("新增付款方式表單", () => {
  it("TapPay hosted fields 尚未可取 prime 時停用儲存按鈕", () => {
    render(<TestAddPaymentForm />);

    expect(screen.getByLabelText("持卡人姓名")).toBeInTheDocument();
    expect(screen.getByLabelText("帳單 Email")).toBeInTheDocument();
    expect(screen.getByText("卡號")).toBeInTheDocument();
    expect(screen.getByText("到期日")).toBeInTheDocument();
    expect(screen.getByText("CVC")).toBeInTheDocument();
    expect(
      screen.getByText(
        "卡號由 TapPay 安全欄位處理，不會進入 BillingVault 狀態。",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "儲存卡片" })).toBeDisabled();
  });

  it("TapPay hosted fields 可取 prime 時啟用儲存按鈕並顯示有效狀態", () => {
    render(<TestAddPaymentForm cardStatus={readyCardStatus} />);

    expect(screen.getByRole("button", { name: "儲存卡片" })).toBeEnabled();
    expect(screen.getByText("卡號有效。")).toBeInTheDocument();
    expect(screen.getByText("到期日有效。")).toBeInTheDocument();
    expect(screen.getByText("CVC有效。")).toBeInTheDocument();
  });

  it("TapPay hosted fields 格式錯誤時顯示欄位錯誤", () => {
    render(
      <TestAddPaymentForm
        cardStatus={{
          canGetPrime: false,
          hasInteracted: true,
          status: {
            number: 2,
            expiry: 2,
            ccv: 2,
          },
        }}
      />,
    );

    expect(screen.getByText("卡號格式不正確。")).toBeInTheDocument();
    expect(screen.getByText("到期日格式不正確。")).toBeInTheDocument();
    expect(screen.getByText("CVC格式不正確。")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "儲存卡片" })).toBeDisabled();
  });

  it("送出中時顯示綁定中並停用操作", () => {
    render(
      <TestAddPaymentForm cardStatus={readyCardStatus} isSubmitting={true} />,
    );

    expect(screen.getByRole("button", { name: "綁定中" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "取消" })).toBeDisabled();
  });

  it("表單錯誤會顯示在送出按鈕上方", () => {
    render(<TestAddPaymentForm error="請確認信用卡欄位都已正確填寫。" />);

    expect(
      screen.getByText("請確認信用卡欄位都已正確填寫。"),
    ).toBeInTheDocument();
  });
});
