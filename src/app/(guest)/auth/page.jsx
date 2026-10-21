import Login from "@/components/form/auth/login";
import Register from "@/components/form/auth/register";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AuthPage = () => {
    return (
        <div className="flex flex-1 items-center justify-center w-full">
            <div className="flex max-w-sm items-center justify-center w-full">
                <Tabs defaultValue="login" className="gap-6 w-full!">
                    <TabsList className="w-full!">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <Login />
                    </TabsContent>
                    <TabsContent value="register">
                        <Register />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default AuthPage;
