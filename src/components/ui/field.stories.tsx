import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "./button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "./field";
import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const meta = {
  title: "UI/Field",
  component: Field,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal", "responsive"],
      description: "控制欄位標籤、控制項與輔助文字的排列方式。",
      table: {
        type: {
          summary: '"vertical" | "horizontal" | "responsive"',
        },
        defaultValue: {
          summary: '"vertical"',
        },
      },
    },
    children: {
      control: false,
    },
  },
  args: {
    orientation: "vertical",
  },
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <FieldGroup className="max-w-md">
      <Field {...args}>
        <FieldLabel htmlFor="customer-email">Email</FieldLabel>
        <Input
          id="customer-email"
          type="email"
          placeholder="demo@billingvault.dev"
        />
        <FieldDescription>
          This address receives receipts and checkout alerts.
        </FieldDescription>
      </Field>
    </FieldGroup>
  ),
};

export const Invalid: Story = {
  render: () => (
    <FieldGroup className="max-w-md">
      <Field data-invalid>
        <FieldLabel htmlFor="invalid-email">Email</FieldLabel>
        <Input
          id="invalid-email"
          type="email"
          defaultValue="demo"
          aria-invalid
        />
        <FieldError>Enter a valid email address.</FieldError>
      </Field>
    </FieldGroup>
  ),
};

export const WithErrorsArray: Story = {
  render: () => (
    <FieldGroup className="max-w-md">
      <Field data-invalid>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input id="password" type="password" aria-invalid />
        <FieldError
          errors={[
            { message: "Use at least 8 characters." },
            { message: "Add one number." },
            { message: "Use at least 8 characters." },
          ]}
        />
      </Field>
    </FieldGroup>
  ),
};

export const FieldSetExample: Story = {
  render: () => (
    <FieldSet className="max-w-md">
      <FieldLegend>Payment method</FieldLegend>
      <FieldDescription>
        All transactions are encrypted before authorization.
      </FieldDescription>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="card-name">Name on card</FieldLabel>
          <Input id="card-name" placeholder="Ada Lovelace" />
        </Field>
        <Field>
          <FieldLabel htmlFor="card-number">Card number</FieldLabel>
          <Input id="card-number" placeholder="4242 4242 4242 4242" />
          <FieldDescription>
            Enter the 16-digit number printed on the card.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <FieldGroup className="max-w-md">
      <Field orientation="horizontal">
        <FieldLabel htmlFor="risk-alerts">Risk alerts</FieldLabel>
        <Input id="risk-alerts" placeholder="alerts@billingvault.dev" />
      </Field>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle>Chargeback monitoring</FieldTitle>
          <FieldDescription>
            Notify the billing team when disputes need review.
          </FieldDescription>
        </FieldContent>
        <Button variant="outline">Manage</Button>
      </Field>
    </FieldGroup>
  ),
};

export const Responsive: Story = {
  render: () => (
    <FieldGroup className="max-w-2xl">
      <Field orientation="responsive">
        <FieldLabel htmlFor="billing-cycle">Billing cycle</FieldLabel>
        <Select defaultValue="monthly">
          <SelectTrigger id="billing-cycle" className="w-full">
            <SelectValue placeholder="Select cycle" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <FieldDescription>
          Yearly billing applies the current annual discount.
        </FieldDescription>
      </Field>
    </FieldGroup>
  ),
};

export const WithSeparator: Story = {
  render: () => (
    <FieldGroup className="max-w-md">
      <Field>
        <FieldLabel htmlFor="account-email">Account email</FieldLabel>
        <Input
          id="account-email"
          type="email"
          placeholder="demo@billingvault.dev"
        />
      </Field>
      <FieldSeparator>Security</FieldSeparator>
      <Field>
        <FieldLabel htmlFor="webhook-secret">Webhook secret</FieldLabel>
        <Input id="webhook-secret" type="password" placeholder="sk_test_..." />
        <FieldDescription>
          Use this key to verify checkout event signatures.
        </FieldDescription>
      </Field>
    </FieldGroup>
  ),
};
