import { register } from "@/actions/auth";
import { useMutation } from "@tanstack/react-query";

const useRegisterUser = () => {
    return useMutation({
        mutationKey: ["register"],
        mutationFn: register,
    });
};

export default useRegisterUser;
