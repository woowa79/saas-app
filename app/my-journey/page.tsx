import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CompanionsList from "@/components/CompanionsList";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { getUserCompanions, getUserSessions } from "@/lib/actions/companion.actions";

const MyJourneyPage = async () => {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const [companions, sessionHistory] = await Promise.all([
        getUserCompanions(user.id),
        getUserSessions(user.id).catch(() => []),
    ]);

    return (
        <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10 lg:w-3/4">
            <section className="flex items-center justify-between gap-4 max-sm:flex-col">
                <div className="flex items-center gap-4">
                    <Image
                        src={user.imageUrl}
                        alt={user.firstName ?? "User"}
                        width={110}
                        height={110}
                        className="rounded-full object-cover"
                    />

                    <div className="flex flex-col gap-2">
                        <h1 className="font-bold text-2xl">
                            {user.firstName} {user.lastName}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {user.emailAddresses[0]?.emailAddress}
                        </p>
                    </div>
                </div>

                <div className="space-y-2 text-right max-sm:text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">My Journey</p>
                    <p className="text-base text-slate-600">
                        Review the companions you created and jump back into sessions from one place.
                    </p>
                </div>
            </section>

            <section className="flex gap-4 max-sm:flex-col">
                <div className="flex h-fit flex-col gap-2 rounded-lg border border-black p-3">
                    <div className="flex items-center gap-2">
                        <Image src="/icons/check.svg" alt="checkmark" width={22} height={22} />
                        <p className="text-2xl font-bold">{sessionHistory.length}</p>
                    </div>
                    <div>Lessons completed</div>
                </div>

                <div className="flex h-fit flex-col gap-2 rounded-lg border border-black p-3">
                    <div className="flex items-center gap-2">
                        <Image src="/icons/cap.svg" alt="cap" width={22} height={22} />
                        <p className="text-2xl font-bold">{companions.length}</p>
                    </div>
                    <div>Companions created</div>
                </div>
            </section>

            <Accordion type="multiple" className="rounded-3xl border-2 border-black bg-white px-6 py-2">
                <AccordionItem value="recent">
                    <AccordionTrigger className="text-2xl font-bold">Recent Sessions</AccordionTrigger>
                    <AccordionContent>
                        <CompanionsList title="Recent Sessions" companions={sessionHistory} />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="companions">
                    <AccordionTrigger className="text-2xl font-bold">My Companions ({companions.length})</AccordionTrigger>
                    <AccordionContent>
                        <CompanionsList title="My Companions" companions={companions} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </main>
    );
};

export default MyJourneyPage;