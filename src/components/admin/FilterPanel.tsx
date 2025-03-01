import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Filter, X, Search, ChevronDown } from "lucide-react";

interface FilterPanelProps {
  onFilterChange?: (filters: FilterState) => void;
  barangays?: string[];
  categories?: string[];
  priorities?: string[];
  statuses?: string[];
}

interface FilterState {
  search: string;
  barangay: string;
  category: string;
  priority: string;
  status: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  onFilterChange = () => {},
  barangays = [
    "Barangay A",
    "Barangay B",
    "Barangay C",
    "Barangay D",
    "Barangay E",
  ],
  categories = [
    "Road Damage",
    "Drainage",
    "Electricity",
    "Water Supply",
    "Waste Management",
    "Others",
  ],
  priorities = ["Low", "Medium", "High", "Critical"],
  statuses = ["Pending", "In Progress", "Resolved", "Rejected"],
}) => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    barangay: "",
    category: "",
    priority: "",
    status: "",
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      search: "",
      barangay: "",
      category: "",
      priority: "",
      status: "",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const clearSingleFilter = (key: keyof FilterState) => {
    const newFilters = { ...filters, [key]: "" };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter((value) => value !== "").length;
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search issues..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {getActiveFilterCount() > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full"
                  >
                    {getActiveFilterCount()}
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-8 text-xs"
                  >
                    Clear all
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="barangay">Barangay</Label>
                  <Select
                    value={filters.barangay}
                    onValueChange={(value) =>
                      handleFilterChange("barangay", value)
                    }
                  >
                    <SelectTrigger id="barangay">
                      <SelectValue placeholder="All Barangays" />
                    </SelectTrigger>
                    <SelectContent>
                      {barangays.map((barangay) => (
                        <SelectItem key={barangay} value={barangay}>
                          {barangay}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) =>
                      handleFilterChange("category", value)
                    }
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={filters.priority}
                    onValueChange={(value) =>
                      handleFilterChange("priority", value)
                    }
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="All Priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      handleFilterChange("status", value)
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full mt-2"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {getActiveFilterCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9"
            >
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Active filters display */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {filters.barangay && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 px-3 py-1"
            >
              Barangay: {filters.barangay}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => clearSingleFilter("barangay")}
              />
            </Badge>
          )}
          {filters.category && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 px-3 py-1"
            >
              Category: {filters.category}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => clearSingleFilter("category")}
              />
            </Badge>
          )}
          {filters.priority && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 px-3 py-1"
            >
              Priority: {filters.priority}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => clearSingleFilter("priority")}
              />
            </Badge>
          )}
          {filters.status && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 px-3 py-1"
            >
              Status: {filters.status}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => clearSingleFilter("status")}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
