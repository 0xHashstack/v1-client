import { useToast } from '@chakra-ui/react';

const ErrorToast = ({ title, description }:{title:string,description:string}) => {
  const toast = useToast();

  toast({
    title: title,
    description: description,
    variant:'subtle',
    position:'bottom-right',
    status: 'error',
    duration: 5000,
    isClosable: true,
  });

  return null; // Return null as we don't need to render anything
};

export default ErrorToast;
