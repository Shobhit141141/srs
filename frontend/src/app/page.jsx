import { Flex, Text } from '@radix-ui/themes';
import {Button} from "@nextui-org/button";

export default function() {
  return (
    <Flex direction="column" gap="2">
      <Text>Hello from Radix Themes :)</Text>
      <Button color='success'>This</Button>
    </Flex>
  );
}
