"use client";

import { useState } from "react";
import { differenceInDays, format } from "date-fns";
import {
  ArrowRight,
  CalendarIcon,
  Clock,
  Loader2,
  MapPin,
  Plane,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import type { DateRange } from "react-day-picker";
import Markdown from "react-markdown";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Home() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [people, setPeople] = useState("");
  const [budget, setBudget] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const isFormValid =
    destination && days && people && budget && dateRange?.from && dateRange?.to;

  async function handleGenerate() {
    if (!isFormValid || !dateRange?.from || !dateRange?.to) return;

    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          days,
          people,
          budget,
          startDate: format(dateRange.from, "yyyy-MM-dd"),
          endDate: format(dateRange.to, "yyyy-MM-dd"),
        }),
      });

      if (!response.ok) throw new Error("Failed to generate");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let text = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setResult(text);
      }
    } catch {
      setResult("生成旅行计划时出错，请稍后重试。");
    } finally {
      setLoading(false);
    }
  }

  const hasResult = result || loading;

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-indigo-50 to-violet-100 dark:from-slate-950 dark:via-indigo-950 dark:to-violet-950">
      {/* Decorative floating orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-linear-to-br from-purple-300/25 to-pink-300/25 blur-3xl animate-float" />
        <div className="absolute top-1/3 -left-48 w-[400px] h-[400px] rounded-full bg-linear-to-br from-blue-300/20 to-cyan-300/20 blur-3xl animate-float-delayed" />
        <div className="absolute -bottom-32 right-1/4 w-[350px] h-[350px] rounded-full bg-linear-to-br from-indigo-300/25 to-violet-300/25 blur-3xl animate-float-slow" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(129,140,248,0.15),transparent_60%)]" />
      </div>

      <div className="relative mx-auto px-4 py-12 sm:py-20 max-w-2xl lg:max-w-6xl xl:max-w-7xl">
        {/* Hero */}
        <div className="mb-10 text-center animate-fade-in-up">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 px-4 py-1.5 border border-indigo-300/30 dark:border-indigo-700/40 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
              Powered by Google Gemini
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="bg-linear-to-r from-slate-900 via-indigo-900 to-slate-800 dark:from-white dark:via-indigo-200 dark:to-white bg-clip-text text-transparent">
              AI{" "}
            </span>
            <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              旅行规划师
            </span>
          </h1>

          <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
            输入你的旅行偏好，AI 为你生成
            <span className="font-semibold text-foreground"> 专属旅行计划</span>
          </p>
        </div>

        {/* Two-column layout on lg+ */}
        <div className="lg:grid lg:grid-cols-[440px_1fr] xl:grid-cols-[480px_1fr] lg:gap-8 xl:gap-10">
          {/* Left: Form (sticky on desktop) */}
          <div className="lg:sticky lg:top-8 lg:self-start animate-fade-in-up [animation-delay:150ms]">
            <Card className="relative overflow-hidden border border-indigo-200/50 dark:border-indigo-800/50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-xl shadow-indigo-500/5">
              <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500" />
              <div className="absolute top-0 right-0 w-48 h-48 bg-linear-to-bl from-purple-400/10 to-transparent rounded-full -translate-y-24 translate-x-24" />

              <CardHeader className="relative pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
                    <Plane className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">
                      旅行信息
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      填写以下信息，生成个性化旅行计划
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative space-y-5 pt-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="destination"
                    className="flex items-center gap-1.5 text-sm font-medium"
                  >
                    <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                    目的地
                  </Label>
                  <Input
                    id="destination"
                    placeholder="例如：东京、巴黎、曼谷..."
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-sm font-medium">
                    <CalendarIcon className="h-3.5 w-3.5 text-indigo-500" />
                    出行日期
                  </Label>
                  <Popover>
                    <PopoverTrigger
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "h-9 w-full justify-start gap-2 text-left font-normal"
                      )}
                    >
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <span>
                            {format(dateRange.from, "yyyy/MM/dd")} &ndash;{" "}
                            {format(dateRange.to, "yyyy/MM/dd")}
                          </span>
                        ) : (
                          <span>{format(dateRange.from, "yyyy/MM/dd")}</span>
                        )
                      ) : (
                        <span className="text-muted-foreground">
                          选择出行日期范围
                        </span>
                      )}
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={(range) => {
                          setDateRange(range);
                          if (range?.from && range?.to) {
                            setDays(
                              String(differenceInDays(range.to, range.from) + 1)
                            );
                          }
                        }}
                        numberOfMonths={2}
                        disabled={{ before: new Date() }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="days"
                      className="flex items-center gap-1.5 text-sm font-medium"
                    >
                      <Clock className="h-3.5 w-3.5 text-indigo-500" />
                      旅行天数
                    </Label>
                    <Input
                      id="days"
                      type="number"
                      min="1"
                      placeholder="选择日期后自动计算"
                      value={days}
                      readOnly
                      className="cursor-default"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="people"
                      className="flex items-center gap-1.5 text-sm font-medium"
                    >
                      <Users className="h-3.5 w-3.5 text-indigo-500" />
                      出行人数
                    </Label>
                    <Input
                      id="people"
                      type="number"
                      min="1"
                      placeholder="人数"
                      value={people}
                      onChange={(e) => setPeople(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="budget"
                    className="flex items-center gap-1.5 text-sm font-medium"
                  >
                    <Wallet className="h-3.5 w-3.5 text-indigo-500" />
                    预算金额（元）
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    min="0"
                    placeholder="总预算，例如：10000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  />
                </div>

                <div className="pt-2">
                  <Button
                    size="lg"
                    className="w-full h-11 text-base gap-2 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 border-0 group"
                    onClick={handleGenerate}
                    disabled={loading || !isFormValid}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        正在生成旅行计划...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                        生成旅行计划
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Result */}
          <div className="mt-8 lg:mt-0 min-w-0">
            {hasResult ? (
              <Card className="relative overflow-hidden border border-purple-200/50 dark:border-purple-800/50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-xl shadow-purple-500/5 animate-fade-in-up">
                <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-purple-500 via-pink-500 to-amber-400" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-linear-to-tr from-purple-400/8 to-transparent rounded-full translate-y-24 -translate-x-24" />

                <CardHeader className="relative pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <h2 className="text-lg font-semibold tracking-tight">
                      你的旅行计划
                    </h2>
                  </div>
                </CardHeader>

                <CardContent className="relative">
                  {result ? (
                    <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-heading prose-h2:text-xl prose-h3:text-lg prose-p:leading-relaxed prose-li:leading-relaxed prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-strong:text-foreground">
                      <Markdown>{result}</Markdown>
                    </article>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <div className="p-3.5 rounded-2xl bg-linear-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10">
                        <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        AI 正在为你规划旅行...
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="hidden lg:flex flex-col items-center justify-center rounded-2xl border border-dashed border-indigo-300/40 dark:border-indigo-700/40 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm py-24 animate-fade-in-up [animation-delay:200ms]">
                <div className="p-5 rounded-2xl bg-linear-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 mb-5">
                  <Plane className="h-10 w-10 text-indigo-300 dark:text-indigo-600" />
                </div>
                <p className="text-sm text-muted-foreground/60">
                  填写左侧旅行信息后，计划将在这里展示
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
