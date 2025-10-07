import { Box, Button, Text, Title } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { twMerge } from "tailwind-merge";
const PageNotFound = ({ height = "h-screen" }: { height?: string }) => {
  return (
    <Box
      className={twMerge(
        "text-center flex items-center justify-center flex-col h-screen md:p-0 p-10"
      )}
      h={height}
    >
      <Title fw="bold">404</Title>
      <Text my={20} c="dimmed">
        Oops, it looks like the page you're looking for doesn't exist.
      </Text>
      <Button component={Link} to="/">
        Go Back
      </Button>
    </Box>
  );
};

export default PageNotFound;
