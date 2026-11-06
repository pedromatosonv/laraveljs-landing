---
title: Deployment concepts
group: The Basics
order: 4
---

## Deployment

The deployment illustration shows an application sharing a runtime with supporting resources such as a database and a queue worker. It explores how autoscaling could increase capacity under load and reduce it when the application is idle.

See [Environment variables](../configuration/#environment-variables) for the proposed configuration model.

## Preview environments

A preview environment gives a pull request a separate URL for review. An implementation would provision isolated resources, apply migrations to a preview database, and clean up the environment when the pull request closes.

## Observability

An observability workflow links slow requests and failed jobs to the logs and operations that explain what happened. The illustration on the landing page uses Laravel Nightwatch as a visual reference for this workflow.
