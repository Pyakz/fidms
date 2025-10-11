import { organization, useActiveOrganization } from "@/lib/auth";
import { branchesQuery } from "@/lib/queryOptions";
import { Avatar, Center, Loader, Popover, Select } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { startCase } from "lodash";

const BranchSelector = () => {
  const { data: activeOrganization, isPending } = useActiveOrganization();
  const { data: branches, isFetching, isRefetching } = useQuery(branchesQuery);
  const [minimized] = useLocalStorage({
    key: "sidebar-minimized",
  });

  if (minimized) {
    return (
      <Popover position="right-start" withArrow shadow="md" width={200}>
        <Popover.Target>
          <Avatar
            src={activeOrganization?.logo}
            alt={activeOrganization?.name}
            name={activeOrganization?.name}
            radius={4}
            className="rounded cursor-pointer"
            size={45}
            variant="light"
          />
        </Popover.Target>
        <Popover.Dropdown p={5}>
          {isPending || isFetching || isRefetching ? (
            <Center className="p-5">
              <Loader size="xs" />
            </Center>
          ) : (
            <Select
              rightSection={
                isPending || isFetching || isRefetching ? (
                  <Loader size="xs" />
                ) : null
              }
              disabled={isPending || isFetching || isRefetching}
              data={branches?.map((branch) => ({
                ...branch,
                value: branch.id,
                label: startCase(branch.name),
              }))}
              value={activeOrganization?.id ?? undefined}
              comboboxProps={{ shadow: "lg" }}
              size="md"
              allowDeselect={false}
              onChange={async (val) => {
                await organization.setActive({ organizationId: val });
                window.location.reload();
              }}
              defaultDropdownOpened
            />
          )}
        </Popover.Dropdown>
      </Popover>
    );
  }

  return (
    <Select
      rightSection={
        isPending || isFetching || isRefetching ? <Loader size="xs" /> : null
      }
      disabled={isPending || isFetching || isRefetching}
      data={branches?.map((branch) => ({
        ...branch,
        value: branch.id,
        label: startCase(branch.name),
      }))}
      value={activeOrganization?.id ?? undefined}
      comboboxProps={{ shadow: "lg" }}
      size="sm"
      className="w-full"
      allowDeselect={false}
      onChange={async (val) => {
        await organization.setActive({ organizationId: val });
        window.location.reload();
      }}
    />
  );
};

export default BranchSelector;
