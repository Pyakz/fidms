import { organization, useActiveOrganization } from "@/lib/auth";
import { branchesQuery } from "@/lib/queryOptions";
import { Loader, Select } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

const BranchSelector = () => {
  const { data: activeOrganization, isPending } = useActiveOrganization();
  const { data: branches, isFetching, isRefetching } = useQuery(branchesQuery);

  return (
    <Select
      rightSection={
        isPending || isFetching || isRefetching ? <Loader size="xs" /> : null
      }
      disabled={isPending || isFetching || isRefetching}
      data={branches?.map((branch) => ({
        ...branch,
        value: branch.id,
        label: branch.name,
      }))}
      value={activeOrganization?.id ?? undefined}
      comboboxProps={{ shadow: "md" }}
      size="md"
      allowDeselect={false}
      onChange={async (val) => {
        await organization.setActive({ organizationId: val });
        window.location.reload();
      }}
    />
  );
};

export default BranchSelector;
