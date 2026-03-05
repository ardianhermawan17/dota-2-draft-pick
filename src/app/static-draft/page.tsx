"use client";

import { useEffect, useState } from "react";
import {useLazyFindByIdQuery} from "@shared/api/draft-rules-api";
import {DraftSchedule} from "@shared/components/template/draft-schedule";
import type {TemplateDraftRuleEntry} from "@shared/types/domain/template-draft-rules";
import {Button} from "@shared/components/ui/button";
import {DraftAnnouncer} from "@shared/components/template/draft-announcer";

const DATA_ENTRIES: TemplateDraftRuleEntry[] = [
    {
        "id": "4f509663-d805-4f50-9cff-7ec0789b0926",
        "note": "Initial radian ban 4",
        "count": 4,
        "rule_id": "60a4cd67-d017-4a99-83aa-cdd2df8f4918",
        "team_side": "radiant",
        "created_at": "2026-03-02T10:39:21+00:00",
        "action_type": "ban",
        "sequence_index": 1,
        "per_action_seconds": 30
    },
    {
        "id": "50e509b8-a1c9-4820-ab67-d4c97d53623b",
        "note": "Initial dire ban 4",
        "count": 4,
        "rule_id": "60a4cd67-d017-4a99-83aa-cdd2df8f4918",
        "team_side": "dire",
        "created_at": "2026-03-02T11:54:15+00:00",
        "action_type": "ban",
        "sequence_index": 2,
        "per_action_seconds": 30
    },
    {
        "id": "42512a05-c57e-4249-8232-2cf5c6af50f4",
        "note": "radiant team pick 2 heroes",
        "count": 2,
        "rule_id": "60a4cd67-d017-4a99-83aa-cdd2df8f4918",
        "team_side": "radiant",
        "created_at": "2026-03-02T11:57:30+00:00",
        "action_type": "pick",
        "sequence_index": 3,
        "per_action_seconds": 30
    },
    {
        "id": "63883f99-7d18-4c01-acad-85f06758e442",
        "note": "dire team pick 2 heroes",
        "count": 2,
        "rule_id": "60a4cd67-d017-4a99-83aa-cdd2df8f4918",
        "team_side": "dire",
        "created_at": "2026-03-02T12:10:59+00:00",
        "action_type": "pick",
        "sequence_index": 4,
        "per_action_seconds": 30
    },
    {
        "id": "b0196999-5424-4f09-91f5-6c04fc20dbf3",
        "note": "radiant team ban 2 heroes",
        "count": 2,
        "rule_id": "60a4cd67-d017-4a99-83aa-cdd2df8f4918",
        "team_side": "radiant",
        "created_at": "2026-03-02T12:11:52+00:00",
        "action_type": "ban",
        "sequence_index": 5,
        "per_action_seconds": 30
    },
    {
        "id": "154b9b49-6b68-41b0-bbf2-009e4eb60559",
        "note": "dire team ban 2 heroes",
        "count": 2,
        "rule_id": "60a4cd67-d017-4a99-83aa-cdd2df8f4918",
        "team_side": "dire",
        "created_at": "2026-03-02T12:13:45+00:00",
        "action_type": "ban",
        "sequence_index": 6,
        "per_action_seconds": 30
    },
    {
        "id": "aafbc5e5-e692-4613-b570-9f9261625247",
        "note": "radiant team pick 2 heroes",
        "count": 2,
        "rule_id": "60a4cd67-d017-4a99-83aa-cdd2df8f4918",
        "team_side": "radiant",
        "created_at": "2026-03-02T12:14:31+00:00",
        "action_type": "pick",
        "sequence_index": 7,
        "per_action_seconds": 30
    },
    {
        "id": "891b10a8-0424-4aee-950e-1f2369cafcf0",
        "note": "dire team pick 2 heroes",
        "count": 2,
        "rule_id": "60a4cd67-d017-4a99-83aa-cdd2df8f4918",
        "team_side": "dire",
        "created_at": "2026-03-02T12:15:33+00:00",
        "action_type": "pick",
        "sequence_index": 8,
        "per_action_seconds": 30
    },
    {
        "id": "4c97883b-f01a-49cb-887a-415f70dc81ff",
        "note": "radiant team ban 1 heroes",
        "count": 1,
        "rule_id": "60a4cd67-d017-4a99-83aa-cdd2df8f4918",
        "team_side": "radiant",
        "created_at": "2026-03-02T12:16:56+00:00",
        "action_type": "ban",
        "sequence_index": 9,
        "per_action_seconds": 30
    },
    {
        "id": "9b407fbe-e04a-497d-b295-57d59245d09f",
        "note": "dire team ban 1 heroes",
        "count": 1,
        "rule_id": "60a4cd67-d017-4a99-83aa-cdd2df8f4918",
        "team_side": "dire",
        "created_at": "2026-03-02T12:18:02+00:00",
        "action_type": "ban",
        "sequence_index": 10,
        "per_action_seconds": 30
    },
    {
        "id": "0e770f0e-77bd-4d3a-bd53-f254d03750c8",
        "note": "last pick, radiant team pick 1 heroes",
        "count": 1,
        "rule_id": "60a4cd67-d017-4a99-83aa-cdd2df8f4918",
        "team_side": "radiant",
        "created_at": "2026-03-02T12:19:00+00:00",
        "action_type": "pick",
        "sequence_index": 11,
        "per_action_seconds": 30
    },
    {
        "id": "e54d972f-9110-4bca-b795-7965a5dace2c",
        "note": "last pick, dire team pick 1 heroes",
        "count": 1,
        "rule_id": "60a4cd67-d017-4a99-83aa-cdd2df8f4918",
        "team_side": "dire",
        "created_at": "2026-03-02T12:19:39+00:00",
        "action_type": "pick",
        "sequence_index": 12,
        "per_action_seconds": 30
    }
]
export default function StaticDraftPage() {
    const [triggerGetFindByIdQuery, { data, isLoading }] = useLazyFindByIdQuery();
    const [isRadiant, setIsRadiant] = useState(true);
    const [isPick, setIsPick] = useState(true);

    useEffect(() => {
        triggerGetFindByIdQuery({
            params: {
                id: "60a4cd67-d017-4a99-83aa-cdd2df8f4918" // Replace with an actual UUID from your database
            }
        });
    }, [triggerGetFindByIdQuery]);

    if (isLoading) {
        return <div>Loading draft rules...</div>;
    }

    return (
        <div className="flex justify-center min-h-screen pt-20">
            <div className="p-6 flex flex-col gap-8">
                <h1 className="text-2xl font-bold">Static Draft Page</h1>

                <div className="flex justify-between gap-8">
                    <Button onClick={() => setIsRadiant((prevState) => !prevState)}>Toggle Side</Button>
                    <Button onClick={() => setIsPick((prevState) => !prevState)}>Toggle Action Type</Button>
                </div>
                {/* Container reads entities from Redux */}
                <DraftAnnouncer
                    active_time_side={isRadiant ? "radiant" : "dire"}  // "radiant" | "dire"
                    active_action_type={isPick ? "pick" : "ban"} // "pick" | "ban"
                    autoplayOnChange={true}
                    cooldownMs={1500}
                    volume={0.9}
                />
                <DraftSchedule
                    template_draft_rule_entries={DATA_ENTRIES}
                    active_time_side={isRadiant ? "radiant" : "dire"}
                    ruleId="60a4cd67-d017-4a99-83aa-cdd2df8f4918" // Pass the same ID
                />
            </div>
        </div>
    );
}