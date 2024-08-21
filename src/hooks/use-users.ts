import {queryOptions, useQuery} from "@tanstack/react-query";
import {getAllUsers} from "@/actions/user";

const usersOptions = queryOptions({
    queryKey: ["users"],
    queryFn: () => getAllUsers()
})

export const useUsers = () => {
    return useQuery(usersOptions)
}
