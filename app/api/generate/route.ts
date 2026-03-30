import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
  const { destination, days, people, budget, startDate, endDate } =
    await req.json();

  console.log("destination", destination);
  console.log("days", days);
  console.log("people", people);
  console.log("budget", budget);
  console.log("startDate", startDate);
  console.log("endDate", endDate);

  const result = streamText({
    model: google("gemini-2.5-flash"),
    prompt: `你是一位经验丰富的专业旅行规划师。请根据以下信息，制定一份详细、实用的旅行计划。

## 旅行信息
- **目的地**：${destination}
- **旅行天数**：${days}天
- **人数**：${people}人
- **总预算**：${budget}元人民币
- **出行日期**：${startDate} 至 ${endDate}

## 请输出以下内容（使用 Markdown 格式）

1. **旅行概览**：简要介绍目的地亮点和此次行程的核心主题
2. **每日详细行程**：每天的具体安排，包括景点、活动、用餐建议和交通方式
3. **餐饮推荐**：每天推荐当地特色餐厅或美食
4. **交通指南**：往返交通和当地出行建议
5. **住宿建议**：推荐适合预算的住宿选项
6. **预算分配**：详细的费用分解（交通、住宿、餐饮、门票、其他）
7. **旅行小贴士**：目的地的注意事项、必带物品、天气提醒等

请确保计划合理、预算可行，并给出具体的金额估算。`,
  });

  return result.toTextStreamResponse();
}
