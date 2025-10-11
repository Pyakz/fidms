import { ActionIcon, Badge, TextInput } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { Spotlight, SpotlightActionData, spotlight } from "@mantine/spotlight";
import { IconSearch } from "@tabler/icons-react";

const actions: SpotlightActionData[] = Array(3000)
  .fill(0)
  .map((_, index) => ({
    id: `action-${index}`,
    label: `Action ${index}`,
    description: `Action ${index} description`,
    onClick: () => console.log("Here"),
  }));

const GlobalSearch = () => {
  useHotkeys([["ctrl+K", spotlight.open]]);
  return (
    <>
      <ActionIcon
        hiddenFrom="sm"
        size="lg"
        variant="default"
        onClick={spotlight.open}
      >
        <IconSearch size={15} stroke={1.5} />
      </ActionIcon>

      <TextInput
        leftSection={<IconSearch size={15} stroke={1.5} />}
        onClick={spotlight.open}
        rightSection={
          <Badge
            size="xs"
            radius={3}
            variant="light"
            color="gray"
            visibleFrom="sm"
          >
            Ctrl + K
          </Badge>
        }
        rightSectionWidth={70}
        visibleFrom="sm"
      />
      <Spotlight
        actions={actions}
        nothingFound="Nothing found..."
        highlightQuery
        limit={7}
        searchProps={{
          leftSection: <IconSearch size={20} stroke={1.5} />,
          placeholder: "Search...",
        }}
      />
    </>
  );
};

export default GlobalSearch;
