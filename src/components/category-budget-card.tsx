import { type CategoryBudgetProps } from "@/lib/interface";
import DropdownDeleteEdit from "./dropdown-delete-edit";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { calculateBar, currency } from "@/lib/utils";
import { Progress } from "./ui/progress";
import { BgColor } from "./monthly-budget";
import CreateCategoryBudget from "./create-category-budget";
import AlertDeleteCategoryBudget from "./alert-delete-category-budget";

export default function CategoryBudgetCard({
  setLoading,
  categoryBudget,
  currency_type,
}: Readonly<{
  setLoading: (loading: boolean) => void;
  categoryBudget: CategoryBudgetProps;
  currency_type: string;
}>) {
  return (
    <Card className="@container/card flex h-[9rem] w-[22rem] flex-col justify-center gap-1 text-justify">
      <CardHeader>
        <CardDescription className="text-foreground text-sm @md/card:text-base">
          {categoryBudget?.category?.icon_image}
          {categoryBudget?.category?.name}
        </CardDescription>
        <CardTitle className="flex flex-col gap-7 text-lg font-semibold break-all tabular-nums @md/card:text-3xl">
          <div>
            {`${currency_type}${currency(Number(categoryBudget?.totalExpense)) ?? 0} of ${currency_type}${currency(Number(categoryBudget?.category_budget.amount_limit))}`}
          </div>
          <div>
            <Progress
              className="h-[0.7rem] max-sm:h-[0.5rem]"
              indicatorColor={`${BgColor(categoryBudget?.totalExpense ?? "0", categoryBudget?.category_budget.amount_limit ?? "0")}`}
              value={
                calculateBar(
                  categoryBudget?.totalExpense ?? 0,
                  categoryBudget?.category_budget.amount_limit ?? "0",
                ) <= 100
                  ? calculateBar(
                      categoryBudget?.totalExpense ?? 0,
                      categoryBudget?.category_budget.amount_limit ?? "0",
                    )
                  : 100
              }
            />
          </div>
        </CardTitle>
        <CardAction>
          <DropdownDeleteEdit
            editContent={
              <CreateCategoryBudget
                setLoading={setLoading}
                user_id={categoryBudget?.category_budget.user_id}
                budget_id={categoryBudget?.category_budget.id}
                category_id={categoryBudget?.category_budget.category_id.toString()}
                defaultAmount={categoryBudget?.category_budget.amount_limit}
                isUpdate={true}
                placeholder="Update"
              />
            }
            deleteContent={
              <AlertDeleteCategoryBudget
                category_budget_id={categoryBudget?.category_budget.id}
                setLoading={setLoading}
              />
            }
          />
        </CardAction>
      </CardHeader>
    </Card>
  );
}
