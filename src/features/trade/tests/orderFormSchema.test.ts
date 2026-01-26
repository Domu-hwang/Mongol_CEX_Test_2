import { describe, it, expect } from "vitest"; // Assuming Vitest is used
import { createOrderFormSchema } from "../schemas/orderFormSchema";

describe("OrderFormSchema Validation", () => {
    const marketPrice = 100; // Mock market price for testing purposes

    it("should validate a valid LIMIT BUY order", () => {
        const schema = createOrderFormSchema(marketPrice);
        const data = {
            side: "buy",
            orderType: "limit",
            price: "99",
            amount: "1",
            triggerPrice: "",
        };
        expect(() => schema.parse(data)).not.toThrow();
    });

    it("should invalidate a LIMIT BUY order without price", () => {
        const schema = createOrderFormSchema(marketPrice);
        const data = {
            side: "buy",
            orderType: "limit",
            price: "",
            amount: "1",
            triggerPrice: "",
        };
        expect(() => schema.parse(data)).toThrow("Price is required and must be positive for Limit and Stop orders.");
    });

    it("should validate a valid MARKET BUY order", () => {
        const schema = createOrderFormSchema(marketPrice);
        const data = {
            side: "buy",
            orderType: "market",
            price: "", // Price is optional for market orders
            amount: "1",
            triggerPrice: "",
        };
        expect(() => schema.parse(data)).not.toThrow();
    });

    it("should invalidate a MARKET BUY order without amount", () => {
        const schema = createOrderFormSchema(marketPrice);
        const data = {
            side: "buy",
            orderType: "market",
            price: "",
            amount: "",
            triggerPrice: "",
        };
        expect(() => schema.parse(data)).toThrow("Amount is required.");
    });

    it("should validate a valid STOP BUY order", () => {
        const schema = createOrderFormSchema(marketPrice);
        const data = {
            side: "buy",
            orderType: "stop",
            price: "98",
            amount: "1",
            triggerPrice: "95", // Trigger price <= market price for buy stop
        };
        expect(() => schema.parse(data)).not.toThrow();
    });

    it("should invalidate a STOP BUY order with trigger price > market price", () => {
        const schema = createOrderFormSchema(marketPrice);
        const data = {
            side: "buy",
            orderType: "stop",
            price: "98",
            amount: "1",
            triggerPrice: "105", // Invalid trigger price
        };
        expect(() => schema.parse(data)).toThrow("For a Buy Stop order, Trigger Price must be less than or equal to the current market price.");
    });

    it("should invalidate a STOP BUY order without trigger price", () => {
        const schema = createOrderFormSchema(marketPrice);
        const data = {
            side: "buy",
            orderType: "stop",
            price: "98",
            amount: "1",
            triggerPrice: "",
        };
        expect(() => schema.parse(data)).toThrow("Trigger Price is required and must be positive for Stop orders.");
    });

    it("should validate a valid STOP SELL order", () => {
        const schema = createOrderFormSchema(marketPrice);
        const data = {
            side: "sell",
            orderType: "stop",
            price: "102",
            amount: "1",
            triggerPrice: "105", // Trigger price >= market price for sell stop
        };
        expect(() => schema.parse(data)).not.toThrow();
    });

    it("should invalidate a STOP SELL order with trigger price < market price", () => {
        const schema = createOrderFormSchema(marketPrice);
        const data = {
            side: "sell",
            orderType: "stop",
            price: "102",
            amount: "1",
            triggerPrice: "95", // Invalid trigger price
        };
        expect(() => schema.parse(data)).toThrow("For a Sell Stop order, Trigger Price must be greater than or equal to the current market price.");
    });

    it("should handle zero or negative amounts", () => {
        const schema = createOrderFormSchema(marketPrice);
        const data = {
            side: "buy",
            orderType: "limit",
            price: "100",
            amount: "0", // Invalid amount
            triggerPrice: "",
        };
        expect(() => schema.parse(data)).toThrow("Amount is required.");
    });
});