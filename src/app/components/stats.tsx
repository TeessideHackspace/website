"use client";
import Header from "../components/header/header";
import { Chart } from "react-google-charts";
import { MembershipApiService } from "../lib/service/service";

interface StatsData {
  num_members: number;
  avg_subscription?: string;
  num_less_average: number;
  income: number;
  average: number;
  all_amounts: number[];
}
export default function Stats({ stats }: { stats: StatsData }) {
  const expenses = [
    {
      label: "Rent",
      v: 710,
    },
    {
      label: "Service Charge",
      v: 52.91,
    },
    {
      label: "Building Insurance",
      v: 29.16,
    },
    {
      label: "Liability Insurance",
      v: 28,
    },
    {
      label: "Accounting",
      v: 33,
    },
    {
      label: "Electricity",
      v: 100,
    },
    {
      label: "Gas",
      v: 50,
    },
    {
      label: "Water",
      v: 22.16,
    },
    {
      label: "Internet",
      v: 38.4,
    },
    {
      label: "Hosting & Email",
      v: 8.22,
    },
  ];
  const totalExpense = expenses.reduce(function (p, c) {
    p += c.v;
    return p;
  }, 0);

  const data = {
    cols: [
      { id: "t", label: "Type", type: "string" },
      { id: "a", label: "Amount", type: "number" },
      { role: "style", type: "string" },
    ],
    rows: [
      {
        c: [{ v: "Subscriptions" }, { v: stats.income / 100 }, { v: "green" }],
      },
      {
        c: [{ v: "Expenses" }, { v: totalExpense }, { v: "red" }],
      },
    ],
  };
  const balanceChartOptions = {
    hAxis: {
      format: "£##.##",
      minValue: 0,
      viewWindow: { min: 0 },
    },
    legend: { position: "none" },
  };

  const expensesChart = {
    type: "PieChart",
    data: {
      cols: [
        { id: "t", label: "Type", type: "string" },
        { id: "e", label: "Amount", type: "number" },
      ],
      rows: expenses.map(function (x) {
        return {
          c: [{ v: x.label }, { v: x.v }],
        };
      }),
    },
  };

  const histogram = {
    data: {
      cols: [{ id: "a", label: "Amount", type: "number" }],
      rows: stats.all_amounts.map(function (x) {
        return {
          c: [{ v: x / 100 }],
        };
      }),
    },
    options: {
      legend: { position: "none" },
      histogram: { bucketSize: 5 },
    },
  };

  stats.avg_subscription = (
    Math.floor(stats.income / stats.num_members) / 100
  ).toFixed(2);
  return (
    <div className="row hs-body">
      <p>
        <strong>
          Teesside Hackspace is entirely funded by your membership subscriptions
          &amp; donations.
        </strong>
      </p>
      <p>
        {`We are currently barely breaking even, to avoid dipping further into our
        cash reserves we can't spend more money on making the space more awesome
        until we're making a significant monthly surplus.`}
      </p>

      <div className="card-group p-5">
        <div className="card text-center text-bg-primary">
          <div className="card-header">Number of Members</div>
          <div className="card-body">
            <h1>{stats.num_members}</h1>
          </div>
        </div>
        <div className="card text-center text-bg-info">
          <div className="card-header">Average Subscription</div>
          <div className="card-body">
            <h1>£{stats.avg_subscription}</h1>
          </div>
        </div>
        <div className="card text-center text-bg-warning">
          <div className="card-header">Number paying less than average</div>
          <div className="card-body">
            <h1>{stats.num_less_average}</h1>
          </div>
        </div>
      </div>

      <article>
        <h1>Our Monthly Balance</h1>
        <Chart
          chartType="BarChart"
          data={data}
          height="300px"
          width="100%"
          options={balanceChartOptions}
        ></Chart>
      </article>

      <article>
        <h1>Distribution of Subscriptions</h1>
        <Chart
          chartType="Histogram"
          data={histogram.data}
          options={histogram.options}
          height="400px"
          width="100%"
        ></Chart>
      </article>

      <article className="mt-5">
        <h1>Our Monthly Expenses</h1>

        <Chart
          chartType="PieChart"
          data={expensesChart.data}
          height="600px"
          width="100%"
        ></Chart>
      </article>

      <article>
        <header>
          <h2>How You Can Help</h2>
        </header>
        <ul>
          <li>
            <strong className="large">
              <a href="/members">Join Teesside Hackspace today!</a>
            </strong>
            {`
            You'll get 24/7 access, a storage box for your projects, and warm
            fuzzy feelings for supporting us. Our recommended minimum
            subscription is £15/month. For students, retirees or low income
            members the minimum subscription is £5/month.`}
          </li>
          <li>
            {`If you're already a member,`}
            <strong className="large">
              increase your monthly subscription payment
            </strong>
            {` by a few pounds.`}
          </li>
          <li>
            Volunteer to run a workshop on your area of expertise, or help us
            keep our infrastructure in shape.
          </li>
          <li>
            {`Let us know if there's something you'd like added to or changed in
            the Hackspace that would convince you to pay more each month.`}
          </li>
        </ul>
      </article>
    </div>
  );
}
