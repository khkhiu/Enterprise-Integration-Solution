# HR-Onboarding Integration Solution

This repository contains a project designed to integrate two enterprise systems: an HR system and an onboarding system. The solution ensures seamless automation of onboarding tasks when a new employee is added to the HR system.

## Overview

The project connects:  
1. **HR System (System A):** Manages employee records.  
2. **Onboarding System (System B):** Automates onboarding tasks such as account creation and equipment issuance.  

When a new employee is added to the HR system, the solution triggers onboarding tasks automatically and sequentially.

---

## Features

### Implemented:
- **Employee Onboarding Automation:**
  - Detects new employee records in the HR system.
  - Triggers the following onboarding tasks sequentially:
    1. Account creation.
    2. Issue of onboarding essentials (e.g., laptop, staff pass, welcome goody bag).  

- **Integration Workflow:**
  - Designed with Kafka as the messaging layer for reliable communication.
  - Event-driven architecture ensures efficiency and scalability.  

- **Failure Management:**
  - Retry mechanisms for failed tasks.
  - Logs for error tracking and debugging.

### Pending Enhancements:
1. **New Employee Declaration:**
   - Add functionality for managing declarations (e.g., ownership of property, shares, business interests, or indebtedness).  
2. **Meeting Scheduler:**
   - Schedule onboarding sessions with HR or team leads.  

3. **Advanced Failure Management:**
   - Implement a dashboard to monitor and manually retry failed tasks.

4. **Cloud Deployment:**  
   - Deploy the solution on a cloud platform (AWS, Azure, or GCP).
   - Include deployment scripts and documentation.

---

## Assumptions
1. The HR system emits a message/event when a new employee is added.
2. Employee data includes all necessary details for onboarding tasks.
3. Kafka is the primary messaging system for integration between systems.
4. Sequential task execution is required to avoid dependency issues.

---

## Tech Stack

### Frontend:
- **React** (with TypeScript): UI for monitoring integration workflows and logs.

### Backend:
- **Spring Boot** (Java): Core integration logic and APIs.
- **Kafka:** Message broker for reliable and scalable communication.
- **MySQL:** Database for storing employee and onboarding task data.

### Infrastructure:
- **Docker Compose:** Containerized development environment.

---
