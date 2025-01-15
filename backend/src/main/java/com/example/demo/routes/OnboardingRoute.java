package com.example.demo.routes;

import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.springframework.stereotype.Component;

@Component
public class OnboardingRoute extends RouteBuilder {
    @Override
    public void configure() throws Exception {
        onException(Exception.class)
            .log("Error occurred: ${exception.message}")
            .to("direct:failure-handler");

        // Updated Kafka endpoint with correct broker address
        from("kafka:new-employees?brokers=kafka:9092&groupId=demo-consumer-group")
            .log("New employee added: ${body}")
            .to("direct:account-creation");

        from("direct:account-creation")
            .log("Creating account for: ${body}")
            .process(new FailureSimulator("Account creation"))
            .to("direct:onboarding-tasks");

        from("direct:onboarding-tasks")
            .log("Issuing laptop, staff pass, and goody bag for: ${body}")
            .process(new FailureSimulator("Onboarding tasks"))
            .to("log:done");

        from("direct:failure-handler")
            .log("Failure handled: ${body}");
    }

    private static class FailureSimulator implements Processor {
        private final String taskName;

        public FailureSimulator(String taskName) {
            this.taskName = taskName;
        }

        @Override
        public void process(Exchange exchange) throws Exception {
            if (Math.random() < 0.2) { // 20% chance of failure
                throw new Exception(taskName + " failed.");
            }
        }
    }
}