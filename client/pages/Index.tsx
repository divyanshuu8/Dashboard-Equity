import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  Wallet,
} from "lucide-react";
import { Stock, PortfolioResponse } from "@shared/api";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercentage(percent: number): string {
  return `${percent > 0 ? "+" : ""}${percent.toFixed(2)}%`;
}

export default function Index() {
  const [portfolioData, setPortfolioData] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const response = await axios.get<PortfolioResponse>(
          "https://angelone-smartapi.onrender.com/portfolio",
        ); // replace with your actual endpoint
        if (response.data.status) {
          setPortfolioData(response.data.data);
        } else {
          console.error("API responded with an error:", response.data.message);
        }
      } catch (error) {
        console.error("Failed to fetch portfolio data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  const calculatePortfolioMetrics = () => {
    const totalInvestment = portfolioData.reduce(
      (sum, stock) => sum + stock.averageprice * stock.quantity,
      0,
    );
    const currentValue = portfolioData.reduce(
      (sum, stock) => sum + stock.ltp * stock.quantity,
      0,
    );
    const totalPnL = portfolioData.reduce(
      (sum, stock) => sum + stock.profitandloss,
      0,
    );
    const totalPnLPercentage =
      totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;
    const gainers = portfolioData.filter(
      (stock) => stock.profitandloss > 0,
    ).length;
    const losers = portfolioData.filter(
      (stock) => stock.profitandloss < 0,
    ).length;

    return {
      totalInvestment,
      currentValue,
      totalPnL,
      totalPnLPercentage,
      gainers,
      losers,
      totalStocks: portfolioData.length,
    };
  };

  const metrics = calculatePortfolioMetrics();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <PieChart className="h-7 w-7 text-primary" />
                Portfolio Dashboard
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Track your investments and performance
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">
                Live Data
              </Badge>
              <div className="text-right">
                <p className="text-xs text-slate-500">Last Updated</p>
                <p className="text-sm font-medium">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Investment Equity
              </CardTitle>
              <Wallet className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {formatCurrency(metrics.totalInvestment)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Across {metrics.totalStocks} stocks
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Current Value
              </CardTitle>
              <DollarSign className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {formatCurrency(metrics.currentValue)}
              </div>
              <p className="text-xs text-slate-500 mt-1">Market valuation</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Additional Assets
              </CardTitle>
            
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                ₹2230(MF) + ₹7978
              </div>
              <p className="text-xs text-slate-500 mt-1">Wallet valuation</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total P&L
              </CardTitle>
              {metrics.totalPnL >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${metrics.totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {formatCurrency(metrics.totalPnL)}
              </div>
              <p
                className={`text-xs mt-1 ${metrics.totalPnL >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {formatPercentage(metrics.totalPnLPercentage)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Holdings Table */}
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">
              Your Holdings
            </CardTitle>
            <CardDescription>
              Detailed view of all your stock positions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Stock</TableHead>
                  <TableHead className="text-right font-semibold">
                    Qty
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Avg Price
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    LTP
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Current Value
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    P&L
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    P&L %
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolioData.map((stock) => (
                  <TableRow
                    key={stock.symboltoken}
                    className="hover:bg-slate-50/50"
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium text-slate-900">
                          {stock.tradingsymbol.replace("-EQ", "")}
                        </div>
                        <div className="text-xs text-slate-500">
                          {stock.exchange}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {stock.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{stock.averageprice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{stock.ltp.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(stock.ltp * stock.quantity)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`font-medium ${stock.profitandloss >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {formatCurrency(stock.profitandloss)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={`${
                          stock.pnlpercentage >= 0
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-red-200 bg-red-50 text-red-700"
                        }`}
                      >
                        {formatPercentage(stock.pnlpercentage)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-green-800 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Top Gainers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {portfolioData
                  .filter((stock) => stock.profitandloss > 0)
                  .sort((a, b) => b.pnlpercentage - a.pnlpercentage)
                  .slice(0, 3)
                  .map((stock) => (
                    <div
                      key={stock.symboltoken}
                      className="flex items-center justify-between p-3 bg-white/60 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          {stock.tradingsymbol.replace("-EQ", "")}
                        </p>
                        <p className="text-sm text-slate-600">
                          {formatCurrency(stock.profitandloss)}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        +{stock.pnlpercentage.toFixed(2)}%
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-red-800 flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Top Losers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {portfolioData
                  .filter((stock) => stock.profitandloss < 0)
                  .sort((a, b) => a.pnlpercentage - b.pnlpercentage)
                  .slice(0, 3)
                  .map((stock) => (
                    <div
                      key={stock.symboltoken}
                      className="flex items-center justify-between p-3 bg-white/60 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          {stock.tradingsymbol.replace("-EQ", "")}
                        </p>
                        <p className="text-sm text-slate-600">
                          {formatCurrency(stock.profitandloss)}
                        </p>
                      </div>
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        {stock.pnlpercentage.toFixed(2)}%
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
