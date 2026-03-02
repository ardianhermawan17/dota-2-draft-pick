import {Card, CardContent, CardHeader, CardTitle} from "@shared/components/ui/card";
import Link from "next/link";
import {Button} from "@shared/components/ui/button";

export default function Page() {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="p-6 flex flex-col gap-8">
                <Card className="relative w-full max-w-md p-4">
                    <CardHeader>
                        <CardTitle>Result test</CardTitle>
                    </CardHeader>

                    <CardContent className="mt-4 flex gap-3">
                        <Link href="/static-draft">
                            <Button variant="default">Static Draft</Button>
                        </Link>
                        <Link href="/live-draft">
                            <Button variant="outline">Live Draft</Button>
                        </Link>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}