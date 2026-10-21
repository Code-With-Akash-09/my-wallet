import { login } from "@/actions/auth";
import { useMutation } from "@tanstack/react-query";

const useLoginUser = () => {
    return useMutation({
        mutationKey: ["login"],
        mutationFn: login,
    });
};

export default useLoginUser;
