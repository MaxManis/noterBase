import React, { useEffect, useState, useRef } from "react";
import s from "./About.module.css";

type Props = {};

export const About: React.FC<Props> = () => {
  return (
    <div className={s.aboutContent}>
      <div className={s.aboutTitle}>About</div>
      <div>
        <div className={s.title}>
          <strong className={s.noterBaseTitle}>NoterBase:</strong> Your Personal
          Note-Taking Oasis
        </div>

        <p className={s.intro}>
          Introducing <strong className={s.noterBaseTitle}>NoterBase</strong>,
          the ultimate desktop application designed to empower you in the world
          of note-taking, organization, and security. NoterBase is your trusted
          companion for creating, updating, deleting, and securely storing your
          valuable notes, all without the need for an internet connection.
        </p>

        <div className={s.feature}>
          <span className={s.selectKey}>[K]</span>ey Features:
        </div>

        <ol className={s.featureList}>
          <li>
            <strong>Offline Note Management:</strong> NoterBase is your private,
            offline haven for note management. No internet connection is
            required, ensuring that your notes remain exclusively on your
            computer.
          </li>
          <li>
            <strong>Intuitive User Interface:</strong> With its sleek and
            user-friendly interface, NoterBase makes note-taking a breeze.
            Whether you're a seasoned pro or new to digital note-taking, you'll
            feel right at home.
          </li>
          <li>
            <strong> Effortless Note Creation:</strong> Start jotting down your
            thoughts, ideas, and reminders instantly. NoterBase simplifies the
            note-creation process, so you can focus on what matters most.
          </li>
          <li>
            <strong>Update and Delete with Ease:</strong> Edit or remove your
            notes with just a few clicks or taps. Keep your content organized
            and up-to-date effortlessly.
          </li>
          <li>
            <strong> Robust Data Security:</strong> We take your privacy
            seriously. NoterBase encrypts your notes to ensure that they are for
            your eyes only. Your data remains safe and secure on your computer.
          </li>
          <li>
            <strong>Export and Import Functionality:</strong> Seamlessly export
            your notes to a secure file, ensuring you have a backup copy
            whenever you need it. Import notes from encrypted files to access
            your data from anywhere.
          </li>
          <li>
            <strong>Search Functionality:</strong> Easily find the note you need
            with powerful search options. No more digging through stacks of
            paper or endless digital files.
          </li>
        </ol>

        <div className={s.upcomingFeatures}>
          <span className={s.selectKey}>[U]</span>pcoming Features:
        </div>

        <ul className={s.upcomingFeaturesList}>
          <li>
            <strong>Filters:</strong> We're working on bringing you a powerful
            filtering system to help you quickly sort and organize your notes
            based on various criteria.
          </li>
          <li>
            <strong>Hidden Notes:</strong> Soon, you'll have the ability to hide
            certain notes, keeping them out of sight while maintaining easy
            access when needed.
          </li>
          <li>
            <strong>Tagging System:</strong> Our tagging system is in
            development and will soon allow you to keep your notes organized and
            categorized with ease.
          </li>
        </ul>

        <div className={s.whyNoterbase}>
          <span className={s.selectKey}>[W]</span>hy NoterBase?
        </div>

        <p>
          NoterBase is more than just a note-taking app; it's a powerful tool
          designed to simplify your life. Whether you're a student,
          professional, or anyone in need of a reliable and secure note-taking
          solution, NoterBase has got you covered.
          <br />
          With the ability to manage your notes offline, encrypt your data, and
          access upcoming features like filters, hidden notes, and an advanced
          tagging system, NoterBase truly puts you in control of your digital
          notes.
        </p>

        <p>
          Say goodbye to cluttered desks, misplaced paper notes, and the risks
          associated with cloud-based solutions. Take charge of your note-taking
          experience with NoterBase today.
        </p>
        <p>
          Download NoterBase for free and experience the future of note-taking,
          securely and effortlessly.
        </p>

        <a
          href="https://github.com/MaxManis/noterBase"
          target="_blank"
          className="button--main"
          style={{ width: "fit-content" }}
          rel="noreferrer"
        >
          Download NoterBase
        </a>
      </div>{" "}
      <a
        className={s.by}
        href="https://github.com/MaxManis"
        target="_blank"
        rel="noreferrer"
      >
        by Max Bovtun
      </a>
    </div>
  );
};
