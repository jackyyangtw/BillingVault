import { ArrowUpRightIcon, CheckIcon, ShoppingCartIcon } from "lucide-react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Badge } from "./badge";
import { Button } from "./button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

const meta = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm"],
      description: "控制卡片的尺寸樣式。",
      table: {
        type: {
          summary: '"default" | "sm"',
        },
        defaultValue: {
          summary: '"default"',
        },
      },
    },
    children: {
      control: false,
      table: {
        type: {
          summary: "React.ReactNode",
        },
      },
    },
  },
  args: {
    size: "default",
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card className="max-w-md" {...args}>
      <CardHeader>
        <CardTitle>Order summary</CardTitle>
        <CardDescription>
          Review the selected plan before checkout.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="font-medium">Billing Vault Pro</span>
            <span className="text-muted-foreground">Monthly billing</span>
          </div>
          <span className="font-medium">$29.00</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <ShoppingCartIcon data-icon="inline-start" />
          Continue checkout
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Billing method</CardTitle>
        <CardDescription>
          Visa ending in 4242 is your default card.
        </CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <CheckIcon className="text-primary" />
            <span>3D Secure enabled</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon className="text-primary" />
            <span>Fraud checks active</span>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const Small: Story = {
  render: () => (
    <Card size="sm" className="max-w-md">
      <CardHeader>
        <CardTitle>Small card</CardTitle>
        <CardDescription>
          This card uses the compact spacing variant.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Use the small size when the card sits in a dense dashboard or sidebar.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="secondary">
          Action
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const ProductCard: Story = {
  render: () => (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Enterprise checkout</CardTitle>
        <CardDescription>
          Advanced payment protection for high-volume stores.
        </CardDescription>
        <CardAction>
          <Badge variant="secondary">Popular</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-end gap-1">
            <span className="text-3xl font-medium">$99</span>
            <span className="text-muted-foreground pb-1">/ month</span>
          </div>
          <div className="text-muted-foreground flex flex-col gap-2">
            <span>Risk scoring and chargeback monitoring</span>
            <span>Priority checkout uptime alerts</span>
            <span>Unlimited protected transactions</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button className="flex-1">Select plan</Button>
        <Button variant="outline" size="icon" aria-label="View plan details">
          <ArrowUpRightIcon />
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const AllParts: Story = {
  render: () => (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>Card description</CardDescription>
        <CardAction>
          <Badge>Action</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>Card content</p>
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground">Card footer</p>
      </CardFooter>
    </Card>
  ),
};
