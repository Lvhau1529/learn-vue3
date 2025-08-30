<template>
	<div class="max-w-4xl mx-auto my-8 p-6 bg-white shadow-xl rounded-lg">
		<h2 class="text-2xl font-bold mb-6 text-center text-green-600">🏦 Tính Lãi Suất Khoản Vay</h2>

		<!-- Form nhập liệu -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
			<div>
				<label class="block mb-2 font-semibold">Số tiền vay (VND):</label>
				<input type="text" v-model="loanAmountInput" @input="formatInput('loanAmount')" class="w-full p-2 border rounded" placeholder="60.000.000" />
			</div>
			<div>
				<label class="block mb-2 font-semibold">Tiền trả hàng tháng (VND):</label>
				<input type="text" v-model="monthlyPaymentInput" @input="formatInput('monthlyPayment')" class="w-full p-2 border rounded" placeholder="2.381.038" />
			</div>
			<div>
				<label class="block mb-2 font-semibold">Thời gian vay (tháng):</label>
				<input type="number" v-model.number="loanTerm" class="w-full p-2 border rounded" placeholder="48" />
			</div>
		</div>

		<button @click="calculateLoan" class="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition cursor-pointer">💰 Tính Toán Lãi Suất</button>

		<!-- Kết quả -->
		<div v-if="showResults" class="mt-6 space-y-3 bg-gray-50 p-4 rounded">
			<div class="flex justify-between">
				<span class="font-semibold">Lãi suất tháng:</span>
				<span class="text-green-600 font-bold">{{ (monthlyRate * 100).toFixed(3) }} %</span>
			</div>
			<div class="flex justify-between">
				<span class="font-semibold">Lãi suất năm (Danh nghĩa):</span>
				<span class="text-green-600 font-bold">{{ (nominalRate * 100).toFixed(2) }} %</span>
			</div>
			<div class="flex justify-between">
				<span class="font-semibold">Lãi suất năm (Hiệu dụng):</span>
				<span class="text-green-600 font-bold">{{ (effectiveRate * 100).toFixed(2) }} %</span>
			</div>
			<div class="flex justify-between">
				<span class="font-semibold">Tổng tiền trả:</span>
				<span class="text-green-600 font-bold">{{ totalPayment.toLocaleString("vi-VN") }} VND</span>
			</div>
			<div class="flex justify-between">
				<span class="font-semibold">Tổng tiền lãi:</span>
				<span class="text-green-600 font-bold">{{ totalInterest.toLocaleString("vi-VN") }} VND</span>
			</div>
		</div>

		<!-- Bảng lịch trả nợ -->
		<div v-if="showResults" class="mt-8">
			<h3 class="text-xl font-bold mb-3">📑 Chi tiết khoản vay:</h3>
			<div class="overflow-x-auto">
				<table class="min-w-full text-sm border border-gray-200">
					<thead class="bg-blue-600 text-white">
						<tr>
							<th class="px-2 py-2 border">Kỳ</th>
							<th class="px-2 py-2 border">Dư nợ đầu kỳ</th>
							<th class="px-2 py-2 border">Trả gốc</th>
							<th class="px-2 py-2 border">Trả lãi</th>
							<th class="px-2 py-2 border">Tổng trả</th>
							<th class="px-2 py-2 border">Dư nợ còn lại</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="row in schedule" :key="row.period" class="text-right">
							<td class="px-2 py-2 border text-center">{{ row.period }}</td>
							<td class="px-2 py-2 border">{{ row.openingBalance.toLocaleString("vi-VN") }}</td>
							<td class="px-2 py-2 border">{{ row.principalPay.toLocaleString("vi-VN") }}</td>
							<td class="px-2 py-2 border">{{ row.interestPay.toLocaleString("vi-VN") }}</td>
							<td class="px-2 py-2 border">{{ row.totalPay.toLocaleString("vi-VN") }}</td>
							<td class="px-2 py-2 border">{{ row.closingBalance.toLocaleString("vi-VN") }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

// input tạm dạng string để cho phép nhập có dấu "."
const loanAmountInput = ref("");
const monthlyPaymentInput = ref("");
const loanTerm = ref<number>(48);

// kết quả
const monthlyRate = ref(0);
const nominalRate = ref(0);
const effectiveRate = ref(0);
const totalPayment = ref(0);
const totalInterest = ref(0);
const schedule = ref<any[]>([]);
const showResults = ref(false);

// format khi nhập
function formatInput(type: "loanAmount" | "monthlyPayment") {
	let raw = (type === "loanAmount" ? loanAmountInput.value : monthlyPaymentInput.value).replace(/\D/g, "");
	if (raw === "") {
		if (type === "loanAmount") loanAmountInput.value = "";
		else monthlyPaymentInput.value = "";
		return;
	}
	const formatted = new Intl.NumberFormat("vi-VN").format(parseInt(raw));
	if (type === "loanAmount") loanAmountInput.value = formatted;
	else monthlyPaymentInput.value = formatted;
}

function parseInput(value: string): number {
	return parseInt(value.replace(/\./g, "")) || 0;
}

// Newton-Raphson để tìm lãi suất tháng
function calculateInterestRate(principal: number, payment: number, months: number): number {
	let rate = 0.01;
	for (let i = 0; i < 100; i++) {
		let factor = Math.pow(1 + rate, months);
		let f = (principal * rate * factor) / (factor - 1) - payment;
		let df = (principal * (factor * (months * rate + 1) - 1)) / Math.pow(factor - 1, 2);
		let newRate = rate - f / df;
		if (Math.abs(newRate - rate) < 1e-12) return newRate;
		rate = newRate > 0 ? newRate : 0.0001;
	}
	return rate;
}

function calculateLoan() {
	const principal = parseInput(loanAmountInput.value);
	const payment = parseInput(monthlyPaymentInput.value);
	const months = loanTerm.value;

	if (!principal || !payment || !months) {
		alert("Vui lòng nhập đủ dữ liệu");
		return;
	}

	// Tính lãi suất và các thông tin tổng quát
	const i = calculateInterestRate(principal, payment, months);
	monthlyRate.value = i;
	nominalRate.value = i * 12;
	effectiveRate.value = Math.pow(1 + i, 12) - 1;
	totalPayment.value = payment * months;
	totalInterest.value = totalPayment.value - principal;

	// Sinh bảng chi tiết lịch trả nợ
	const rows = [];
	let balance = principal;
	for (let k = 1; k <= months; k++) {
		const interestPay = balance * i;
		const principalPay = payment - interestPay;
		const closing = balance - principalPay;
		rows.push({
			period: k,
			openingBalance: Math.round(balance),
			principalPay: Math.round(principalPay),
			interestPay: Math.round(interestPay),
			totalPay: payment,
			closingBalance: Math.max(0, Math.round(closing)),
		});
		balance = closing;
	}
	schedule.value = rows;
	showResults.value = true;
}
</script>

