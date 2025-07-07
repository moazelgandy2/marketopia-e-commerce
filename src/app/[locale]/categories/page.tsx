import { CategoriesExplorer } from "@/components/elements/categories-explorer";
import { CategoryWithChildren } from "@/components/elements/category-with-children";
import { ParentCategoriesList } from "@/components/elements/parent-categories-list";

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-12">
        {/* Main Categories Explorer */}
        <section>
          <CategoriesExplorer />
        </section>

        <div className="border-t pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Component Examples
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Parent Categories List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Parent Categories List
              </h3>
              <div className="border rounded-lg p-4">
                <ParentCategoriesList
                  showPagination={false}
                  onCategoryClick={(id) => console.log("Category clicked:", id)}
                />
              </div>
            </div>

            {/* Category with Children (Example with first category) */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Category with Children
              </h3>
              <div className="border rounded-lg p-4">
                <CategoryWithChildren
                  categoryId={8} // Example: Bags category
                  onBack={() => console.log("Back clicked")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
