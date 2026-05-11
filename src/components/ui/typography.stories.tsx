import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  TypographyBlockquote,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyInlineCode,
  TypographyLarge,
  TypographyLead,
  TypographyList,
  TypographyMuted,
  TypographyP,
  TypographySmall,
} from "./typography";

const meta = {
  title: "UI/Typography",
  component: TypographyP,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
    },
  },
  args: {
    children:
      "SecureCart keeps subscription checkout clear, resilient, and easy to audit.",
  },
} satisfies Meta<typeof TypographyP>;

export default meta;

type Story = StoryObj<typeof meta>;

function TypographyOverviewDemo() {
  return (
    <article className="max-w-3xl">
      <TypographyH1>Secure checkout typography</TypographyH1>
      <TypographyLead className="mt-4 text-center">
        A compact scale for product pages, billing flows, and documentation.
      </TypographyLead>

      <section className="mt-10">
        <TypographyH2>Payment clarity</TypographyH2>
        <TypographyP>
          Use headings to create a clear checkout path, then support each step
          with direct body copy and restrained helper text.
        </TypographyP>
        <TypographyP>
          Inline values like <TypographyInlineCode>planId</TypographyInlineCode>{" "}
          or <TypographyInlineCode>customerEmail</TypographyInlineCode> stay
          readable without overpowering the sentence.
        </TypographyP>
      </section>

      <section className="mt-8">
        <TypographyH3>Security signals</TypographyH3>
        <TypographyList>
          <li>Fraud checks run before authorization.</li>
          <li>Webhook events are signed before delivery.</li>
          <li>Receipts include the selected plan and billing interval.</li>
        </TypographyList>
      </section>

      <TypographyBlockquote>
        Clear typography reduces hesitation at the moment a customer commits to
        a subscription.
      </TypographyBlockquote>

      <div className="mt-8 flex flex-col gap-1">
        <TypographyLarge>Enterprise checkout</TypographyLarge>
        <TypographySmall>Updated 2 minutes ago</TypographySmall>
        <TypographyMuted>Protected by adaptive risk scoring.</TypographyMuted>
      </div>
    </article>
  );
}

function TypographyHeadingsDemo() {
  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <TypographyH1>Heading 1</TypographyH1>
      <TypographyH2>Heading 2</TypographyH2>
      <TypographyH3>Heading 3</TypographyH3>
      <TypographyH4>Heading 4</TypographyH4>
    </div>
  );
}

function TypographyBodyTextDemo() {
  return (
    <div className="max-w-2xl">
      <TypographyLead>
        Lead text introduces a page or section with a softer visual weight.
      </TypographyLead>
      <TypographyP>
        Paragraph text carries the main explanation. It should stay readable
        across product cards, checkout details, and account settings.
      </TypographyP>
      <TypographyP>
        Use <TypographyInlineCode>TypographyInlineCode</TypographyInlineCode>{" "}
        for short technical tokens inside prose.
      </TypographyP>
      <TypographyMuted className="mt-4">
        Muted text is useful for timestamps, hints, and secondary metadata.
      </TypographyMuted>
    </div>
  );
}

function TypographyEditorialDemo() {
  return (
    <article className="max-w-2xl">
      <TypographyH2>Checkout review</TypographyH2>
      <TypographyLead className="mt-4">
        Give customers a final, calm moment to confirm plan details.
      </TypographyLead>
      <TypographyP>
        SecureCart groups pricing, billing cadence, and security guarantees so
        the decision feels understandable before payment.
      </TypographyP>
      <TypographyH3>Before charging the card</TypographyH3>
      <TypographyList>
        <li>Confirm the subscription tier.</li>
        <li>Show the renewal date and billing interval.</li>
        <li>Surface risk review and 3D Secure status.</li>
      </TypographyList>
      <TypographyBlockquote>
        A strong checkout interface explains what is about to happen before it
        asks for trust.
      </TypographyBlockquote>
    </article>
  );
}

export const Default: Story = {};

export const Overview: Story = {
  render: () => <TypographyOverviewDemo />,
};

export const Headings: Story = {
  render: () => <TypographyHeadingsDemo />,
};

export const BodyText: Story = {
  render: () => <TypographyBodyTextDemo />,
};

export const Editorial: Story = {
  render: () => <TypographyEditorialDemo />,
};
